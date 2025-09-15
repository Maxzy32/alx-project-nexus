from django.shortcuts import render
from rest_framework import viewsets
from .models import Poll, PollOption
from .serializers import PollSerializer, PollOptionSerializer
from drf_yasg.utils import swagger_auto_schema

class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer

    @swagger_auto_schema(tags=["Polls"], operation_summary="List polls")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Polls"], operation_summary="Retrieve a poll")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Polls"], operation_summary="Create a poll")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class PollOptionViewSet(viewsets.ModelViewSet):
    queryset = PollOption.objects.all()
    serializer_class = PollOptionSerializer

    @swagger_auto_schema(tags=["Poll Options"], operation_summary="List poll options")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Poll Options"], operation_summary="Retrieve a poll option")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Poll Options"], operation_summary="Create a poll option")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)