from rest_framework import serializers
from .models import AuthToken, LoginAttempt, MFAToken

class AuthTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthToken
        fields = ["token_id", "user", "token", "token_type", "expires_at", "revoked", "created_at"]

class LoginAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginAttempt
        fields = ["attempt_id", "user", "ip_address", "success", "attempted_at"]

class MFATokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = MFAToken
        fields = ["mfa_id", "user", "otp_code", "expires_at", "used", "created_at"]
