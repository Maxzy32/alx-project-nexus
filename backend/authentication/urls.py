# authentication/urls.py
from django.urls import path
from .views import LoginView, LogoutView, RefreshTokenView, MFAVerifyView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("refresh/", RefreshTokenView.as_view(), name="refresh_token"),
    path("mfa/verify/", MFAVerifyView.as_view(), name="mfa_verify"),
]
