# Generated by Django 5.1.3 on 2024-11-10 01:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('checkups', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='plan_pdf_url',
        ),
        migrations.AddField(
            model_name='patient',
            name='plan_text',
            field=models.TextField(blank=True, null=True),
        ),
    ]