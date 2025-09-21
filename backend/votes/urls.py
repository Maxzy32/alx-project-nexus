from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VoteViewSet, PollResultsView, UserVoteHistoryView, AdminPollsView

router = DefaultRouter()
router.register(r'', VoteViewSet, basename='vote')  # <-- change here

urlpatterns = [
    path('', include(router.urls)),
    path('polls/<int:poll_id>/results/', PollResultsView.as_view(), name='poll-results'),
    path('users/me/votes/', UserVoteHistoryView.as_view(), name='user-vote-history'),
     path('polls/admin/', AdminPollsView.as_view(), name='admin-polls'),
]
