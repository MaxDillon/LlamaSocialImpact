# Generated by Django 5.1.3 on 2024-11-10 02:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("checkups", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="patient",
            name="plan_pdf_url",
        ),
        migrations.AddField(
            model_name="patient",
            name="phone",
            field=models.TextField(default=""),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="patient",
            name="plan_text",
            field=models.TextField(blank=True, null=True),
        ),
    ]