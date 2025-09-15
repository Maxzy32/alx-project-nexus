from django.db import models

from django.db import models
from django.utils import timezone
from users.models import User

class AuthToken(models.Model):
    token_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    token_type = models.CharField(max_length=20, choices=[('access', 'access'), ('refresh', 'refresh')])
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(default=timezone.now)
    revoked = models.BooleanField(default=False)

    def is_valid(self):
        return not self.revoked and self.expires_at > timezone.now()

class LoginAttempt(models.Model):
    attempt_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    ip_address = models.CharField(max_length=45, null=True, blank=True)
    success = models.BooleanField()
    attempted_at = models.DateTimeField(default=timezone.now)

class MFAToken(models.Model):
    mfa_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=10)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def is_valid(self):
        return not self.used and self.expires_at > timezone.now()

