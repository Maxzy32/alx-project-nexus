from rest_framework import serializers
from .models import Poll, PollOption

class PollOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollOption
        fields = ["option_id", "poll_id", "option_text", "created_at"]
        read_only_fields = ["option_id", "created_at"]

class PollSerializer(serializers.ModelSerializer):
    options = PollOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Poll
        fields = [
            "poll_id",
            "creator_id",
            "title",
            "description",
            "start_time",
            "end_time",
            "is_active",
            "created_at",
            "options",
        ]
        read_only_fields = ["poll_id", "created_at"]
