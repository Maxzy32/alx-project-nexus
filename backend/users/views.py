# from rest_framework import viewsets, status
# from rest_framework.response import Response
# from .models import User
# from .serializers import UserSerializer, UserCreateSerializer
# from drf_yasg.utils import swagger_auto_schema

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()

#     def get_serializer_class(self):
#         if self.action in ["create"]:
#             return UserCreateSerializer
#         return UserSerializer

#     @swagger_auto_schema(tags=["Users"], operation_summary="List users")
#     def list(self, request, *args, **kwargs):
#         return super().list(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Users"], operation_summary="Retrieve a user")
#     def retrieve(self, request, *args, **kwargs):
#         return super().retrieve(request, *args, **kwargs)

#     @swagger_auto_schema(tags=["Users"], operation_summary="Create a user")
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer
        return UserSerializer

    @swagger_auto_schema(tags=["Users"], operation_summary="List users")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Users"], operation_summary="Retrieve a user")
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Users"], operation_summary="Create a user")
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(tags=["Users"], operation_summary="Update a user")
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(tags=["Users"], operation_summary="Partially update a user")
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    # ✅ Custom password change endpoint
    @swagger_auto_schema(
        method="post",
        tags=["Users"],
        operation_summary="Change user password",
        manual_parameters=[
            openapi.Parameter(
                "id", openapi.IN_PATH, description="User ID", type=openapi.TYPE_INTEGER
            )
        ],
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "password": openapi.Schema(type=openapi.TYPE_STRING),
            },
            required=["password"],
        ),
    )
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request, pk=None):
        user = self.get_object()
        new_password = request.data.get("password")

        if not new_password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)
