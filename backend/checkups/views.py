import asyncio
import vapi
from datetime import datetime, timedelta
from django.utils import timezone
from django.shortcuts import render
from django.views.generic import TemplateView
from .services import trigger_call
from .models import Patient, Checkup, CheckupModule, PatientProvider, Provider
from .serializers import CheckupListSerializer, ModuleDetailSerializer

from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Patient, Checkup, CheckupModule, PatientProvider, Provider
from .serializers import CheckupListSerializer, ModuleDetailSerializer
from .utils import (
    extract_text_from_pdf,
    extract_information_from_document,
    verify_module,
)


class PatientViewSet(viewsets.ViewSet):
    """
    API endpoints for managing patients
    """

    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def list(self, request):
        """
        Get all patients
        ---
        responses:
          200:
            description: List of all patients
            schema:
              type: array
              items:
                properties:
                  id:
                    type: string
                    format: uuid
                  name:
                    type: string
                  phone:
                    type: string
                  plan_text:
                    type: string
        """
        patients = Patient.objects.all()
        return Response(
            [
                {
                    "id": patient.id,
                    "name": patient.name,
                    "phone": patient.phone,
                    "plan_text": (
                        patient.plan_text[:200] + "..." if patient.plan_text else None
                    ),
                }
                for patient in patients
            ]
        )

    def create(self, request):
        """
        Create a new patient
        ---
        parameters:
          - name: plan_pdf
            type: file
            required: true
            description: PDF file containing patient plan
          - name: name
            type: string
            required: true
            description: Patient name
          - name: providers
            type: array
            items:
              type: object
              properties:
                name:
                  type: string
                phone:
                  type: string
                role:
                  type: string
            description: List of healthcare providers
        responses:
          201:
            description: Patient created successfully
            schema:
              properties:
                id:
                  type: string
                  format: uuid
                plan_text:
                  type: string
          400:
            description: Invalid input
        """
        pdf_file = request.FILES.get("plan_pdf")
        if not pdf_file:
            return Response(
                {"error": "PDF file is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        plan_text = extract_text_from_pdf(pdf_file)

        if plan_text is None:
            return Response(
                {"error": "Could not process PDF file"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        plan_outline = extract_information_from_document(plan_text)
        print(plan_outline)
        # TODO: handle errors from pydantic extract

        patient = Patient.objects.create(
            name=request.data["name"], plan_text=plan_text, phone=request.data["phone"]
        )

        checkins = plan_outline.checkIns
        for checkin in checkins:
            time = timezone.now() - timedelta(
                days=timezone.now().weekday() + checkin.day_of_week
            )
            dbCheckin = Checkup.objects.create(
                patient=patient,
                description=checkin.description,
                scheduled_for=time,
                goals=checkin.rationale,
                sequence_number=0,
            )
            for module in checkin.modules:
                print("module")
                print(dict(module.moduleConfig))
                CheckupModule.objects.create(
                    checkup=dbCheckin,
                    module_type=module.moduleType,
                    sequence_order=0,
                    inputs=dict(module.moduleConfig),
                )

        providers_data = request.data.get("providers", [])
        if isinstance(providers_data, str):
            import json

            providers_data = json.loads(providers_data)

        for provider_data in providers_data:
            provider = Provider.objects.create(**provider_data)
            PatientProvider.objects.create(patient=patient, provider=provider)

        return Response(
            {
                "id": patient.id,
                "plan_text": plan_text[:200] + "...",  # Preview of extracted text
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"])
    def checkups(self, request, pk=None):
        """
        Get all checkups for a specific patient
        ---
        parameters:
          - name: pk
            type: string
            format: uuid
            required: true
            description: Patient ID
        responses:
          200:
            description: List of checkups
            schema:
              type: array
              items:
                $ref: '#/components/schemas/Checkup'
          404:
            description: Patient not found
        """
        patient = get_object_or_404(Patient, pk=pk)
        checkups = Checkup.objects.filter(patient=patient).prefetch_related("modules")
        serializer = CheckupListSerializer(checkups, many=True)
        return Response(serializer.data)


class CheckupViewSet(viewsets.ViewSet):
    """
    API endpoints for managing checkups
    """

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        """
        Mark a checkup as completed
        ---
        parameters:
          - name: pk
            type: string
            format: uuid
            required: true
            description: Checkup ID
          - name: completed_at
            type: string
            format: date-time
            required: true
            description: Completion timestamp
        responses:
          200:
            description: Checkup marked as completed
          404:
            description: Checkup not found
        """
        checkup = get_object_or_404(Checkup, pk=pk)
        checkup.completed = True
        checkup.completed_at = request.data["completed_at"]
        checkup.save()
        return Response(status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def trigger_call(self, request, pk=None):
        """Trigger a VAPI call for this checkup"""
        checkup = get_object_or_404(Checkup, pk=pk)

        try:
            # Run async call in sync context
            call, call_status = trigger_call(checkup.patient, checkup)
            print(call)

            modules = CheckupModule.objects.filter(checkup=checkup)
            for module in modules:
                print(module.module_type)
                outputs = verify_module(module, call_status.transcript)
                module.outputs = dict(outputs)
                module.save()

            return Response({"call_id": call.id, "status": call.status})
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def list(self, request):
        """List all upcoming checkups"""
        checkups = (
            Checkup.objects.filter(completed=False)
            .select_related("patient")
            .prefetch_related("modules")
            .order_by("scheduled_for")
        )

        data = []
        for checkup in checkups:
            data.append(
                {
                    "id": checkup.id,
                    "patient_name": checkup.patient.name,
                    "patient_phone": checkup.patient.phone,
                    "scheduled_for": checkup.scheduled_for,
                    "description": checkup.description,
                    "goals": checkup.goals,
                    "module_count": checkup.modules.count(),
                    "status": "pending",  # You might want to add a status field to track call status
                }
            )

        return Response(data)


class ModuleViewSet(viewsets.ViewSet):
    """
    API endpoints for managing checkup modules
    """

    def retrieve(self, request, pk=None):
        """
        Get details of a specific module
        ---
        parameters:
          - name: pk
            type: string
            format: uuid
            required: true
            description: Module ID
        responses:
          200:
            description: Module details
            schema:
              $ref: '#/components/schemas/Module'
          404:
            description: Module not found
        """
        module = get_object_or_404(CheckupModule, pk=pk)
        serializer = ModuleDetailSerializer(module)
        return Response(serializer.data)

    def partial_update(self, request, pk=None):
        """
        Update specific fields of a module
        ---
        parameters:
          - name: pk
            type: string
            format: uuid
            required: true
            description: Module ID
          - name: outputs
            type: object
            required: false
            description: Module outputs
          - name: status
            type: string
            required: false
            description: Module status
          - name: transcript
            type: string
            required: false
            description: Module transcript
        responses:
          200:
            description: Module updated successfully
          404:
            description: Module not found
        """
        module = get_object_or_404(CheckupModule, pk=pk)
        print(f"Updating module {pk} with data:", request.data)  # Debug print

        serializer = ModuleDetailSerializer(module, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            print("Updated module:", serializer.data)  # Debug print
            return Response(serializer.data)
        else:
            print("Validation errors:", serializer.errors)  # Debug print
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckupListView(TemplateView):
    template_name = "checkups/list.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Reuse the API endpoint to get data
        viewset = CheckupViewSet()
        response = viewset.list(self.request)
        context["checkups"] = response.data
        return context
