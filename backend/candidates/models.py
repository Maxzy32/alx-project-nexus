from django.db import models
from polls.models import Poll

class Candidate(models.Model):
    candidate_id = models.AutoField(primary_key=True)
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="candidates")
    full_name = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    image_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} ({self.poll.title})"

