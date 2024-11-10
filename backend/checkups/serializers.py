from rest_framework import serializers
from .models import Provider, CheckupModule, Checkup

class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['name', 'phone', 'role']

class ModulePreviewSerializer(serializers.ModelSerializer):
    preview = serializers.SerializerMethodField()

    class Meta:
        model = CheckupModule
        fields = ['id', 'module_type', 'status', 'preview', 'inputs', 'outputs', 'rationale']

    def get_preview(self, obj):
        return f"{obj.module_type} preview"

class CheckupListSerializer(serializers.ModelSerializer):
    modules = ModulePreviewSerializer(many=True, read_only=True)

    class Meta:
        model = Checkup
        fields = ['id', 'sequence_number', 'description', 'goals', 
                 'scheduled_for', 'modules']

class ModuleDetailSerializer(serializers.ModelSerializer):
    outputs = serializers.JSONField(required=False, allow_null=True)  # Explicitly declare JSON fields
    inputs = serializers.JSONField(required=False, allow_null=True)   # Read-only since we don't update it

    class Meta:
        model = CheckupModule
        fields = ['id', 'module_type', 'rationale', 'inputs', 
                 'outputs', 'status', 'transcript']
        read_only_fields = ['id']