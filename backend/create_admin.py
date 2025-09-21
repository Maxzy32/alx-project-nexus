# create_admin.py
from django.contrib.auth import get_user_model
from django.db import IntegrityError

User = get_user_model()

def run():
    username = "admin"
    email = "admin@gmail.com"
    password = "Max@2024"  # Change this before pushing

    try:
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username=username, email=email, password=password)
            print("✅ Superuser created")
        else:
            print("⚠️ Superuser already exists")
    except IntegrityError as e:
        print("❌ Error creating superuser:", e)
