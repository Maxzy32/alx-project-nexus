# your_app/migrations/0002_create_admin.py
from django.db import migrations

def create_admin(apps, schema_editor):
    from your_project_name.create_admin import run
    run()

class Migration(migrations.Migration):

    dependencies = [
        ("poll_system", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_admin),
    ]
