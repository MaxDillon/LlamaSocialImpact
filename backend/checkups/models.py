from django.db import models
import uuid
from django.db.models import JSONField

class Provider(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.TextField()
    phone = models.TextField()
    role = models.TextField()
    active = models.BooleanField(default=True)

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.TextField()
    phone = models.TextField()
    plan_text = models.TextField(null=True, blank=True)  # new field
    providers = models.ManyToManyField(Provider, through='PatientProvider')
    created_at = models.DateTimeField(auto_now_add=True)

class PatientProvider(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, on_delete=models.CASCADE)

class Checkup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    sequence_number = models.IntegerField()
    description = models.TextField()
    goals = models.TextField()
    scheduled_for = models.DateTimeField()
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True)

class CheckupModule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    checkup = models.ForeignKey(Checkup, related_name='modules', on_delete=models.CASCADE)
    module_type = models.TextField()
    rationale = models.TextField()
    sequence_order = models.IntegerField()
    inputs = JSONField(default=dict)
    outputs = JSONField(default=dict, null=True)
    status = models.TextField(default='pending')
    transcript = models.TextField(null=True)