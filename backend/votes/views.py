# from rest_framework.views import APIView
# from rest_framework import viewsets, status
# from candidates.models import Candidate
# from rest_framework.response import Response
# from .models import Vote
# from .serializers import VoteSerializer
# from .serializers import PollResultSerializer
# from channels.layers import get_channel_layer
# from votes.utils import get_poll_results
# from polls.models import Poll, PollOption


# class VoteViewSet(viewsets.ModelViewSet):
#     queryset = Vote.objects.all()
#     serializer_class = VoteSerializer

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         # Save the vote
#         vote = serializer.save()

#         poll = Poll.objects.get(pk=vote.poll.poll_id)
#         results = get_poll_results(poll)


#         # Notify WebSocket clients subscribed to this poll
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             f"poll_{vote.poll.poll_id}_votes",
#             {
#                 "type": "vote_message",
#                 "data": {
#                     "poll_id": vote.poll.poll_id,
#                     "user_id": vote.user.user_id,
#                     "option_id": vote.option.option_id if vote.option else None,
#                     "candidate_id": vote.candidate.candidate_id if vote.candidate else None,
#                     "message": f"New vote in poll {vote.poll.title}",
#                     "data": results,
#                 },
#             }
#         )

#         return Response(
#             {"message": "Vote successfully cast", "vote": VoteSerializer(vote).data},
#             status=status.HTTP_201_CREATED
#         )

# class PollResultsView(APIView):
#     def get(self, request, poll_id):
#         try:
#             poll = Poll.objects.get(pk=poll_id)
#         except Poll.DoesNotExist:
#             return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)

#         # Count votes for poll options
#         option_results = []
#         for option in PollOption.objects.filter(poll=poll):
#             count = Vote.objects.filter(poll=poll, option=option).count()
#             option_results.append({
#                 "option_id": option.option_id,
#                 "option_text": option.option_text,
#                 "votes": count,
#             })

#         # Count votes for candidates
#         candidate_results = []
#         for candidate in Candidate.objects.filter(poll=poll):
#             count = Vote.objects.filter(poll=poll, candidate=candidate).count()
#             candidate_results.append({
#                 "candidate_id": candidate.candidate_id,
#                 "full_name": candidate.full_name,
#                 "votes": count,
#             })

#         # result_data = {
#         #     "poll_id": poll.poll_id,
#         #     "title": poll.title,
#         #     "total_votes": Vote.objects.filter(poll=poll).count(),
#         #     "options": option_results,
#         #     "candidates": candidate_results,
#         # }
        
#         result_data = get_poll_results(poll)
#         serializer = PollResultSerializer(result_data)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# 222222
# from rest_framework.views import APIView
# from rest_framework import viewsets, status, permissions
# from rest_framework.response import Response
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync



# from candidates.models import Candidate
# from .models import Vote
# from .serializers import VoteSerializer, PollResultSerializer, UserVoteHistorySerializer
# from votes.utils import get_poll_results
# from polls.models import Poll, PollOption
# from drf_yasg.utils import swagger_auto_schema


# class VoteViewSet(viewsets.ModelViewSet):
#     queryset = Vote.objects.all()
#     serializer_class = VoteSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     @swagger_auto_schema(tags=["Votes"], operation_summary="List votes")
#     def list(self, request, *args, **kwargs):
#         return super().list(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Votes"], operation_summary="Retrieve a vote")
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Votes"], operation_summary="Create a vote")
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)


#         # Save the vote
#         vote = serializer.save(user=request.user)

#         poll = Poll.objects.get(pk=vote.poll.poll_id)
#         results = get_poll_results(poll)

#         # Notify WebSocket clients subscribed to this poll
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             f"poll_{vote.poll.poll_id}_votes",
#             {
#                 "type": "vote_message",
#                 "data": {
#                     "poll_id": vote.poll.poll_id,
#                     "user_id": vote.user.user_id,
#                     "option_id": vote.option.option_id if vote.option else None,
#                     "candidate_id": vote.candidate.candidate_id if vote.candidate else None,
#                     "message": f"New vote in poll {vote.poll.title}",
#                     "data": results,
#                 },
#             }
#         )

#         return Response(
#             {"message": "Vote successfully cast", "vote": VoteSerializer(vote).data},
#             status=status.HTTP_201_CREATED
#         )


# class UserVoteHistoryView(APIView):


#     def get(self, request):
#         votes = Vote.objects.filter(user=request.user).select_related("poll", "option", "candidate")
#         serializer = UserVoteHistorySerializer(votes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# class PollResultsView(APIView):
#     permission_classes = [permissions.IsAuthenticated]
#     def get(self, request, poll_id):
#         try:
#             poll = Poll.objects.get(pk=poll_id)
#         except Poll.DoesNotExist:
#             return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)

#         option_results = []
#         for option in PollOption.objects.filter(poll=poll):
#             count = Vote.objects.filter(poll=poll, option=option).count()
#             option_results.append({
#                 "option_id": option.option_id,
#                 "option_text": option.option_text,
#                 "votes": count,
#             })

#         candidate_results = []
#         for candidate in Candidate.objects.filter(poll=poll):
#             count = Vote.objects.filter(poll=poll, candidate=candidate).count()
#             candidate_results.append({
#                 "candidate_id": candidate.candidate_id,
#                 "full_name": candidate.full_name,
#                 "votes": count,
#             })

#         result_data = {
#             "poll_id": poll.poll_id,
#             "title": poll.title,
#             "total_votes": Vote.objects.filter(poll=poll).count(),
#             "options": option_results,
#             "candidates": candidate_results,
#         }

#         serializer = PollResultSerializer(result_data)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# from rest_framework.views import APIView
# from rest_framework import viewsets, status, permissions
# from rest_framework.response import Response
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync

# from candidates.models import Candidate
# from .models import Vote
# from .serializers import VoteSerializer, PollResultSerializer, UserVoteHistorySerializer
# from votes.utils import get_poll_results
# from polls.models import Poll, PollOption
# from drf_yasg.utils import swagger_auto_schema


# class VoteViewSet(viewsets.ModelViewSet):
#     queryset = Vote.objects.all()
#     serializer_class = VoteSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     @swagger_auto_schema(tags=["Votes"], operation_summary="List votes")
#     def list(self, request, *args, **kwargs):
#         return super().list(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Votes"], operation_summary="Retrieve a vote")
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Votes"], operation_summary="Create a vote")
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)

#         # Save the vote
#         vote = serializer.save(user=request.user)

#         poll = Poll.objects.get(pk=vote.poll.poll_id)
#         results = get_poll_results(poll)  # returns structured poll results
#         total_votes = Vote.objects.filter(poll=poll).count()

#         # Notify WebSocket clients subscribed to this poll
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             f"poll_{vote.poll.poll_id}_votes",
#             {
#                 "type": "vote_message",
#                 "data": {
#                     "poll_id": vote.poll.poll_id,
#                     "title": poll.title,
#                     "total_votes": total_votes,
#                     "options": results.get("options", []),
#                     "candidates": results.get("candidates", []),
#                 },
#             }
#         )

#         return Response(
#             {"message": "Vote successfully cast", "vote": VoteSerializer(vote).data},
#             status=status.HTTP_201_CREATED
#         )


# class UserVoteHistoryView(APIView):
#     def get(self, request):
#         votes = Vote.objects.filter(user=request.user).select_related("poll", "option", "candidate")
#         serializer = UserVoteHistorySerializer(votes, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)


# class PollResultsView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request, poll_id):
#         try:
#             poll = Poll.objects.get(pk=poll_id)
#         except Poll.DoesNotExist:
#             return Response({"error": "Poll not found"}, status=status.HTTP_404_NOT_FOUND)

#         option_results = []
#         for option in PollOption.objects.filter(poll=poll):
#             count = Vote.objects.filter(poll=poll, option=option).count()
#             option_results.append({
#                 "option_id": option.option_id,
#                 "option_text": option.option_text,
#                 "votes": count,
#             })

#         candidate_results = []
#         for candidate in Candidate.objects.filter(poll=poll):
#             count = Vote.objects.filter(poll=poll, candidate=candidate).count()
#             candidate_results.append({
#                 "candidate_id": candidate.candidate_id,
#                 "full_name": candidate.full_name,
#                 "votes": count,
#             })

#         result_data = {
#             "poll_id": poll.poll_id,
#             "title": poll.title,
#             "total_votes": Vote.objects.filter(poll=poll).count(),
#             "options": option_results,
#             "candidates": candidate_results,
#         }

#         serializer = PollResultSerializer(result_data)
#         return Response(serializer.data, status=status.HTTP_200_OK)


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


class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(tags=["Votes"], operation_summary="List votes")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Votes"], operation_summary="Retrieve a vote")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Votes"], operation_summary="Create a vote")
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Save the vote
        vote = serializer.save(user=request.user)

        poll = Poll.objects.get(pk=vote.poll.poll_id)
        total_votes = Vote.objects.filter(poll=poll).count()

        # per-option counts
        option_results = []
        for option in PollOption.objects.filter(poll=poll):
            count = Vote.objects.filter(poll=poll, option=option).count()
            option_results.append({
                "option_id": option.option_id,
                "option_text": option.option_text,
                "votes": count,
            })

        # per-candidate counts
        candidate_results = []
        for candidate in Candidate.objects.filter(poll=poll):
            count = Vote.objects.filter(poll=poll, candidate=candidate).count()
            candidate_results.append({
                "candidate_id": candidate.candidate_id,
                "full_name": candidate.full_name,
                "votes": count,
            })

        # Notify WebSocket clients subscribed to this poll
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

        option_results = []
        for option in PollOption.objects.filter(poll=poll):
            count = Vote.objects.filter(poll=poll, option=option).count()
            option_results.append({
                "option_id": option.option_id,
                "option_text": option.option_text,
                "votes": count,
            })

        candidate_results = []
        for candidate in Candidate.objects.filter(poll=poll):
            count = Vote.objects.filter(poll=poll, candidate=candidate).count()
            candidate_results.append({
                "candidate_id": candidate.candidate_id,
                "full_name": candidate.full_name,
                "votes": count,
            })

        result_data = {
            "poll_id": poll.poll_id,
            "title": poll.title,
            "total_votes": Vote.objects.filter(poll=poll).count(),
            "options": option_results,
            "candidates": candidate_results,
        }

        serializer = PollResultSerializer(result_data)
        return Response(serializer.data, status=status.HTTP_200_OK)
