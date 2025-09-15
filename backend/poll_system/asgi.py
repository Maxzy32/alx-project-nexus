"""
ASGI config for poll_system project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from django.urls import path
from votes.consumers import VoteConsumer
from polls.consumers import PollConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "poll_system.settings")
django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/votes/<int:poll_id>/", VoteConsumer.as_asgi()),
        ])
    ),
})


application = get_asgi_application()
