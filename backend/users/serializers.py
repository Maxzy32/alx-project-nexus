# from rest_framework import serializers
# from .models import User

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = [
#             "user_id",
#             "username",
#             "email",
#             "must_change_password",
#             "is_active",
#             "last_login",
#             "last_password_change",
#             "created_at",
#         ]
#         read_only_fields = ["user_id", "created_at", "last_login", "last_password_change"]

# class UserCreateSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ["username", "email", "password"]

#     def create(self, validated_data):
#         user = User(
#             username=validated_data["username"],
#             email=validated_data["email"],
#         )
#         user.set_password(validated_data["password"])
#         user.save()
#         return user



from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "user_id",
            "username",
            "email",
            "must_change_password",
            "is_active",
            "last_login",
            "last_password_change",
            "created_at",
            "password",   # ✅ allow password updates
        ]
        read_only_fields = [
            "user_id",
            "created_at",
            "last_login",
            "last_password_change",
        ]

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user
