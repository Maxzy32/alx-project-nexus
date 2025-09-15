from django.db import models
from users.models import User
from polls.models import Poll, PollOption
from candidates.models import Candidate

class Vote(models.Model):
    vote_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="votes")
    poll = models.ForeignKey(Poll, on_delete=models.CASCADE, related_name="votes")
    option = models.ForeignKey(PollOption, on_delete=models.CASCADE, related_name="votes", null=True, blank=True)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name="votes", null=True, blank=True)
    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "poll"], name="unique_vote_per_user_per_poll")
        ]

    def __str__(self):
        return f"Vote by {self.user.username} in poll {self.poll.title}"
