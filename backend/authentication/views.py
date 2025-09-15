from django.shortcuts import render

import jwt, datetime
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import User
from .models import AuthToken, LoginAttempt, MFAToken
from .serializers import AuthTokenSerializer, LoginAttemptSerializer
from drf_yasg.utils import swagger_auto_schema

JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = "HS256"


def generate_jwt(user, token_type="access", minutes=15):
    exp = timezone.now() + datetime.timedelta(minutes=minutes)
    payload = {
        "user_id": user.user_id,
        "username": user.username,
        "type": token_type,
        "exp": exp,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    auth_token = AuthToken.objects.create(
        user=user,
        token=token,
        token_type=token_type,
        expires_at=exp,
    )
    return token


class LoginView(APIView):
    @swagger_auto_schema(
        operation_summary="User login",
        operation_description="Authenticate with username and password. Returns access and refresh tokens.",
        tags=["Authentication"]
    )
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        ip = request.META.get("REMOTE_ADDR")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            LoginAttempt.objects.create(user=None, ip_address=ip, success=False)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, user.password_hash):
            LoginAttempt.objects.create(user=user, ip_address=ip, success=False)
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Log success
        LoginAttempt.objects.create(user=user, ip_address=ip, success=True)

        # Generate tokens
        access_token = generate_jwt(user, "access", minutes=15)
        refresh_token = generate_jwt(user, "refresh", minutes=60 * 24 * 7)  # 7 days

        return Response({
            "access": access_token,
            "refresh": refresh_token,
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    @swagger_auto_schema(
        operation_summary="User logout",
        operation_description="Revoke an active token to log the user out.",
        tags=["Authentication"]
    )
    def post(self, request):
        token = request.data.get("token")
        try:
            auth_token = AuthToken.objects.get(token=token, revoked=False)
            auth_token.revoked = True
            auth_token.save()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except AuthToken.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(APIView):
    @swagger_auto_schema(
        operation_summary="Refresh access token",
        operation_description="Exchange a valid refresh token for a new access token.",
        tags=["Authentication"]
    )
    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the token
            payload = jwt.decode(refresh_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

            # Ensure it's actually a refresh token
            if payload.get("type") != "refresh":
                return Response({"error": "Invalid token type"}, status=status.HTTP_400_BAD_REQUEST)

            # Check if the token exists in DB and is not revoked/expired
            try:
                auth_token = AuthToken.objects.get(token=refresh_token, revoked=False)
            except AuthToken.DoesNotExist:
                return Response({"error": "Invalid or revoked token"}, status=status.HTTP_400_BAD_REQUEST)

            if auth_token.expires_at < timezone.now():
                return Response({"error": "Token expired"}, status=status.HTTP_401_UNAUTHORIZED)

            # Get the user
            user = User.objects.get(pk=payload["user_id"])

            # Issue a new access token (15 minutes)
            new_access_token = generate_jwt(user, "access", minutes=15)

            return Response({
                "access": new_access_token
            }, status=status.HTTP_200_OK)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Refresh token expired"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.InvalidTokenError:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)


class MFAVerifyView(APIView):
    @swagger_auto_schema(
        operation_summary="MFA verification",
        operation_description="Verify an MFA code for the user and issue new access/refresh tokens.",
        tags=["Authentication"]
    )
    def post(self, request):
        username = request.data.get("username")
        code = request.data.get("code")

        try:
            user = User.objects.get(username=username)
            mfa_token = MFAToken.objects.get(user=user, code=code, used=False)

            if mfa_token.expires_at < timezone.now():
                return Response({"error": "MFA token expired"}, status=status.HTTP_400_BAD_REQUEST)

            # Mark MFA token as used
            mfa_token.used = True
            mfa_token.save()

            # Issue new tokens
            access_token = generate_jwt(user, "access", minutes=15)
            refresh_token = generate_jwt(user, "refresh", minutes=60 * 24 * 7)

            return Response({
                "access": access_token,
                "refresh": refresh_token,
            }, status=status.HTTP_200_OK)

        except (User.DoesNotExist, MFAToken.DoesNotExist):
            return Response({"error": "Invalid MFA verification"}, status=status.HTTP_400_BAD_REQUEST)
