# from rest_framework import serializers
# from polls.models import PollOption
# from .models import Vote

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
#         read_only_fields = ["vote_id", "voted_at"]

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

#         class PollResultSerializer(serializers.Serializer):
#     poll_id = serializers.IntegerField()
#     title = serializers.CharField()
#     total_votes = serializers.IntegerField()
#     options = serializers.ListField()
#     candidates = serializers.ListField()

from rest_framework import serializers
from polls.models import PollOption
from .models import Vote


class VoteSerializer(serializers.ModelSerializer):
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
        read_only_fields = ["vote_id", "voted_at"]

    def validate(self, data):
        """
        Ensure that a vote is cast either for an option OR a candidate, not both/none.
        """
        option = data.get("option")
        candidate = data.get("candidate")

        if not option and not candidate:
            raise serializers.ValidationError("You must vote for either an option or a candidate.")
        if option and candidate:
            raise serializers.ValidationError("You cannot vote for both an option and a candidate.")

        return data


class PollResultSerializer(serializers.Serializer):
    poll_id = serializers.IntegerField()
    title = serializers.CharField()
    total_votes = serializers.IntegerField()
    options = serializers.ListField()
    candidates = serializers.ListField()
