
from rest_framework.views import APIView
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from candidates.models import Candidate
from .models import Vote
from .serializers import VoteSerializer, PollResultSerializer, UserVoteHistorySerializer
from polls.models import Poll, PollOption
from drf_yasg.utils import swagger_auto_schema
from rest_framework.exceptions import ValidationError
from django.db import IntegrityError
from rest_framework import status




class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(tags=["Votes"], operation_summary="Create a vote")
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        poll = serializer.validated_data["poll"]
        if Vote.objects.filter(user=request.user, poll=poll).exists():
            return Response(
                {"detail": "You have already voted in this poll."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            
            vote = serializer.save(user=request.user)
        except IntegrityError:
            return Response(
                {"detail": "You have already voted in this poll."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Recalculate poll results ---
        total_votes = Vote.objects.filter(poll=poll).count()

        option_results = [
            {
                "option_id": option.option_id,
                "option_text": option.option_text,
                "votes": Vote.objects.filter(poll=poll, option=option).count(),
            }
            for option in PollOption.objects.filter(poll=poll)
        ]

        candidate_results = [
            {
                "candidate_id": candidate.candidate_id,
                "full_name": candidate.full_name,
                "votes": Vote.objects.filter(poll=poll, candidate=candidate).count(),
            }
            for candidate in Candidate.objects.filter(poll=poll)
        ]

        # Notify WebSocket clients
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"poll_{poll.poll_id}_votes",
            {
                "type": "vote_message",
                "data": {
                    "poll_id": poll.poll_id,
                    "title": poll.title,
                    "total_votes": total_votes,
                    "options": option_results,
                    "candidates": candidate_results,
                },
            }
        )

        return Response(
            {"message": "Vote successfully cast", "vote": VoteSerializer(vote).data},
            status=status.HTTP_201_CREATED
        )
class UserVoteHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        votes = Vote.objects.filter(user=request.user).select_related("poll", "option", "candidate")
        serializer = UserVoteHistorySerializer(votes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PollResultsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, poll_id):
        try:
            poll = Poll.objects.get(pk=poll_id)
        except Poll.DoesNotExist:
            return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)

        # --- options with voters ---
        option_results = []
        for option in PollOption.objects.filter(poll=poll):
            votes = Vote.objects.filter(poll=poll, option=option).select_related("user")
            option_results.append({
                "option_id": option.option_id,
                "option_text": option.option_text,
                "votes": votes.count(),
                "voters": [v.user.username for v in votes]  # 👈 list usernames
            })

        # --- candidates with voters ---
        candidate_results = []
        for candidate in Candidate.objects.filter(poll=poll):
            votes = Vote.objects.filter(poll=poll, candidate=candidate).select_related("user")
            candidate_results.append({
                "candidate_id": candidate.candidate_id,
                "full_name": candidate.full_name,
                "votes": votes.count(),
                "voters": [v.user.username for v in votes]  # 👈 list usernames
            })

        result_data = {
            "poll_id": poll.poll_id,
            "title": poll.title,
            "total_votes": Vote.objects.filter(poll=poll).count(),
            "options": option_results,
            "candidates": candidate_results,
        }

        return Response(result_data, status=status.HTTP_200_OK)



class AdminPollsView(APIView):
    permission_classes = [permissions.IsAuthenticated] 

    def get(self, request):
        # Now request.user is guaranteed to be authenticated
        polls = Poll.objects.filter(creator=request.user)
        data = []

        for poll in polls:
            # Options with votes
            options = []
            for opt in PollOption.objects.filter(poll=poll):
                votes = Vote.objects.filter(poll=poll, option=opt).select_related("user")
                options.append({
                    "option_id": opt.option_id,
                    "option_text": opt.option_text,
                    "votes": votes.count(),
                    "voters": [v.user.username for v in votes]
                })

            # Candidates with votes
            candidates = []
            for cand in Candidate.objects.filter(poll=poll):
                votes = Vote.objects.filter(poll=poll, candidate=cand).select_related("user")
                candidates.append({
                    "candidate_id": cand.candidate_id,
                    "full_name": cand.full_name,
                    "votes": votes.count(),
                    "voters": [v.user.username for v in votes]
                })

            data.append({
                "poll_id": poll.poll_id,
                "title": poll.title,
                "total_votes": Vote.objects.filter(poll=poll).count(),
                "options": options,
                "candidates": candidates
            })

        return Response(data, status=200)
