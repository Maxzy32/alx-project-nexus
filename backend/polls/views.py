# from django.shortcuts import render
# from rest_framework import viewsets
# from .models import Poll, PollOption
# from rest_framework.response import Response
# from .serializers import PollSerializer, PollOptionSerializer
# from rest_framework.permissions import IsAuthenticated
# from django.utils import timezone
# from drf_yasg.utils import swagger_auto_schema
# from rest_framework.decorators import action 

# class PollViewSet(viewsets.ModelViewSet):
#     queryset = Poll.objects.all()
#     serializer_class = PollSerializer

#     @action(detail=False, methods=["get"], url_path="active", url_name="active_poll")
#     def active_poll(self, request):
#         now = timezone.now()
#         active_poll = Poll.objects.filter(is_active=True, start_time__lte=now, end_time__gte=now).first()
#         if active_poll:
#             serializer = self.get_serializer(active_poll)
#             return Response(serializer.data)
#         return Response({"detail": "No active poll found"}, status=404)

#     @swagger_auto_schema(tags=["Polls"], operation_summary="List polls")
#     def list(self, request, *args, **kwargs):
#         return super().list(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Polls"], operation_summary="Retrieve a poll")
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Polls"], operation_summary="Create a poll")
#     def create(self, request, *args, **kwargs):
#         return super().create(request, *args, **kwargs)


# class PollOptionViewSet(viewsets.ModelViewSet):
#     queryset = PollOption.objects.all()
#     serializer_class = PollOptionSerializer

#     @swagger_auto_schema(tags=["Poll Options"], operation_summary="List poll options")
#     def list(self, request, *args, **kwargs):
#         return super().list(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Poll Options"], operation_summary="Retrieve a poll option")
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Poll Options"], operation_summary="Create a poll option")
#     def create(self, request, *args, **kwargs):
#         return super().create(request, *args, **kwargs)


from django.shortcuts import render
from rest_framework import viewsets
from .models import Poll, PollOption
from rest_framework.response import Response
from .serializers import PollSerializer, PollOptionSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action


class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    # permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"], url_path="active", url_name="active_poll")
    def active_poll(self, request):
        """
        Return all currently active polls.
        """
        now = timezone.now()
        # ✅ First, deactivate polls that have expired
        Poll.objects.filter(is_active=True, end_time__lt=now).update(is_active=False)

        active_polls = Poll.objects.filter(
            is_active=True, start_time__lte=now, end_time__gte=now
        )

        if active_polls.exists():
            serializer = self.get_serializer(active_polls, many=True)  # ✅ many=True
            return Response(serializer.data)

        return Response({"detail": "No active polls found"}, status=404)

    @swagger_auto_schema(tags=["Polls"], operation_summary="List polls")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Polls"], operation_summary="Retrieve a poll")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Polls"], operation_summary="Create a poll")
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


# class PollOptionViewSet(viewsets.ModelViewSet):
#     queryset = PollOption.objects.all()
#     serializer_class = PollOptionSerializer
#     # permission_classes = [IsAuthenticated]

#     @swagger_auto_schema(tags=["Poll Options"], operation_summary="List poll options")
#     def list(self, request, *args, **kwargs):
#         return super().list(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Poll Options"], operation_summary="Retrieve a poll option")
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Poll Options"], operation_summary="Create a poll option")
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         print("Payload received:", request.data) 
#         if serializer.is_valid():
#             self.perform_create(serializer)
#             return Response(serializer.data, status=201)
#         else:
#             print("Serializer errors:", serializer.errors)  # <-- logs the exact issues
#             return Response(serializer.errors, status=400)
class PollOptionViewSet(viewsets.ModelViewSet):
    queryset = PollOption.objects.all()
    serializer_class = PollOptionSerializer
    # permission_classes = [IsAuthenticated]  # optional for testing

    @swagger_auto_schema(tags=["Poll Options"], operation_summary="List poll options")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Poll Options"], operation_summary="Retrieve a poll option")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Poll Options"], operation_summary="Create a poll option")
    def create(self, request, *args, **kwargs):
        # Log the payload before calling super()
        print("Payload received (create):", request.data)

        # Call the default create method
        response = super().create(request, *args, **kwargs)

        # Log response after creation
        print("Response data:", response.data)
        return response