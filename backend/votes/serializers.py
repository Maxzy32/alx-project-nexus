from rest_framework import serializers
from polls.models import PollOption
from .models import Vote


# class VoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Vote
#         fields = [
#             "vote_id",
#             "user",
#             "poll",
#             "option",
#             "candidate",
#             "voted_at",
#         ]
#         read_only_fields = ["vote_id", "voted_at", "user"]  # 👈 add "user"

#     def validate(self, data):
#         """
#         Ensure that a vote is cast either for an option OR a candidate, not both/none.
#         """
#         option = data.get("option")
#         candidate = data.get("candidate")

#         if not option and not candidate:
#             raise serializers.ValidationError("You must vote for either an option or a candidate.")
#         if option and candidate:
#             raise serializers.ValidationError("You cannot vote for both an option and a candidate.")

#         return data

# votes/serializers.py
from rest_framework import serializers
from .models import Vote
from users.serializers import UserSerializer   # 👈 import your user serializer

class VoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # 👈 nested serializer

    class Meta:
        model = Vote
        fields = [
            "vote_id",
            "user",
            "poll",
            "option",
            "candidate",
            "voted_at",
        ]
        read_only_fields = ["vote_id", "voted_at", "user"]

    def validate(self, data):
        option = data.get("option")
        candidate = data.get("candidate")

        if not option and not candidate:
            raise serializers.ValidationError("You must vote for either an option or a candidate.")
        if option and candidate:
            raise serializers.ValidationError("You cannot vote for both an option and a candidate.")

        return data


class UserVoteHistorySerializer(serializers.ModelSerializer):
    poll_title = serializers.CharField(source="poll.title", read_only=True)
    option_text = serializers.CharField(source="option.option_text", read_only=True)
    candidate_name = serializers.CharField(source="candidate.full_name", read_only=True)

    class Meta:
        model = Vote
        fields = ["vote_id", "poll_id", "poll_title", "option_id", "option_text",
                  "candidate_id", "candidate_name", "voted_at"]



class PollResultSerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()
    title = serializers.CharField()
    total_votes = serializers.IntegerField()
    options = serializers.ListField()
    candidates = serializers.ListField()
