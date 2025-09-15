from rest_framework import serializers
from .models import Candidate

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = [
            "candidate_id",
            "poll",
            "full_name",
            "bio",
            "image_url",
            "created_at",
        ]
        read_only_fields = ["candidate_id", "created_at"]
