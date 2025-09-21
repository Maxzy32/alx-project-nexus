# from rest_framework import serializers
# from .models import Poll, PollOption

# class PollOptionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PollOption
#         fields = ["option_id", "poll_id", "option_text", "created_at"]
#         read_only_fields = ["option_id", "created_at"]

# class PollSerializer(serializers.ModelSerializer):
#     options = PollOptionSerializer(many=True, read_only=True)

#     class Meta:
#         model = Poll
#         fields = [
#             "poll_id",
#             "creator_id",
#             "title",
#             "description",
#             "start_time",
#             "end_time",
#             "is_active",
#             "created_at",
#             "options",
#         ]
#         read_only_fields = ["poll_id", "created_at"]
from rest_framework import serializers
from .models import Poll, PollOption
from users.models import User

class PollOptionSerializer(serializers.ModelSerializer):
    poll_id = serializers.PrimaryKeyRelatedField(
        source="poll",  # maps to the Poll foreign key
        queryset=Poll.objects.all()  # required for write
    )

    class Meta:
        model = PollOption
        fields = ["option_id", "poll_id", "option_text", "created_at"]
        read_only_fields = ["option_id", "created_at"]


class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)
    creator_id = serializers.PrimaryKeyRelatedField(
        source='creator',  # maps to the model's creator field
        queryset=User.objects.all(),
        write_only=True
    )

    class Meta:
        model = Poll
        fields = [
            "poll_id",
            "creator_id",  # now works
            "title",
            "description",
            "start_time",
            "end_time",
            "is_active",
            "created_at",
            "options",
        ]
        read_only_fields = ["poll_id", "created_at"]
