# poll_system/create_admin.py
from django.contrib.auth import get_user_model

User = get_user_model()

def run():
    username = "admin"
    email = "admin@gmail.com"
    password = "Max@2024"  # ⚠️ Change this after first deploy!

    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print("✅ Superuser created")
    else:
        print("⚠️ Superuser already exists")
