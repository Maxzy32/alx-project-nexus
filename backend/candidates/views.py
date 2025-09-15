from rest_framework import viewsets
from .models import Candidate
from .serializers import CandidateSerializer
from drf_yasg.utils import swagger_auto_schema

class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer

    @swagger_auto_schema(tags=["Candidates"], operation_summary="List candidates")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Candidates"], operation_summary="Retrieve a candidate")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Candidates"], operation_summary="Create a candidate")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Candidates"], operation_summary="Update a candidate")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Candidates"], operation_summary="Delete a candidate")
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)