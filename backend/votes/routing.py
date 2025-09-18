# votes/routing.py
from django.urls import re_path
from .consumers import VoteConsumer

websocket_urlpatterns = [
    re_path(r"ws/votes/(?P<poll_id>\d+)/$", VoteConsumer.as_asgi()),
]
