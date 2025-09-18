# authentication/authentication.py
import jwt
from django.conf import settings
from django.utils import timezone
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from users.models import User
from .models import AuthToken

JWT_SECRET = settings.SECRET_KEY
JWT_ALGORITHM = "HS256"


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return None  # no authentication attempt

        token = auth_header.split(" ")[1]

        try:
            # ✅ Decode JWT (PyJWT automatically checks `exp` if it's a timestamp)
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        # ✅ Check DB for revoked/expired token
        try:
            auth_token = AuthToken.objects.get(token=token, revoked=False)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed("Token revoked or not found")

        if auth_token.expires_at < timezone.now():
            raise AuthenticationFailed("Token expired")

        # ✅ Load the user from payload
        try:
            user = User.objects.get(pk=payload["user_id"])
        except User.DoesNotExist:
            raise AuthenticationFailed("User not found")

        return (user, None)
