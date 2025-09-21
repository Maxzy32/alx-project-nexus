from celery import shared_task
from django.utils import timezone
from .models import Poll

@shared_task
def deactivate_expired_polls():
    now = timezone.now()
    updated = Poll.objects.filter(is_active=True, end_time__lt=now).update(is_active=False)
    return f"{updated} polls deactivated"
