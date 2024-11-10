from django.contrib import admin

from django.contrib import admin
from .models import Patient, Provider, Checkup, CheckupModule, PatientProvider

@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'phone', 'active']
    search_fields = ['name', 'role']

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']

@admin.register(Checkup)
class CheckupAdmin(admin.ModelAdmin):
    list_display = ['patient', 'sequence_number', 'scheduled_for', 'completed']
    list_filter = ['completed']
    search_fields = ['patient__name']

@admin.register(CheckupModule)
class CheckupModuleAdmin(admin.ModelAdmin):
    list_display = ['checkup', 'module_type', 'status']
    list_filter = ['module_type', 'status']
    search_fields = ['checkup__patient__name']

