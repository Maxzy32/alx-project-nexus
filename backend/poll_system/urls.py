"""
URL configuration for poll_system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from polls.views import PollViewSet, PollOptionViewSet
from authentication.views import LoginView, LogoutView
from django.urls import path, include, re_path
from rest_framework import permissions
from candidates.views import CandidateViewSet
from votes.views import VoteViewSet
from votes.views import PollResultsView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf.urls.static import static


schema_view = get_schema_view(
    openapi.Info(
        title="ALX Project Nexus API",
        default_version="v1",
        description="API documentation for Users, Polls, Candidates, Votes, and Authentication",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="support@alx-nexus.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    urlconf="poll_system.urls",  # ✅ point to the correct urls.py
)


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'polls', PollViewSet, basename='poll')
router.register(r'poll-options', PollOptionViewSet, basename='poll-option')
router.register(r'candidates', CandidateViewSet, basename='candidate')
# router.register(r'votes', VoteViewSet, basename='vote')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path("api/auth/", include("authentication.urls")),
    path("api/polls/<int:poll_id>/results/", PollResultsView.as_view(), name="poll-results"),
     # Include votes app URLs
    path("api/votes/", include("votes.urls")),

    # Swagger docs
    re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    path("swagger/", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    path("redoc/", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),

    ]


