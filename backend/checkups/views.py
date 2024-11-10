from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Patient, Checkup, CheckupModule, PatientProvider, Provider
from .serializers import CheckupListSerializer, ModuleDetailSerializer

from rest_framework import viewsets, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Patient, Checkup, CheckupModule, PatientProvider, Provider
from .serializers import CheckupListSerializer, ModuleDetailSerializer
from .utils import extract_text_from_pdf

class PatientViewSet(viewsets.ViewSet):
    """
    API endpoints for managing patients
    """
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    
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
        pdf_file = request.FILES.get('plan_pdf')
        if not pdf_file:
            return Response(
                {'error': 'PDF file is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        plan_text = extract_text_from_pdf(pdf_file)
        if plan_text is None:
            return Response(
                {'error': 'Could not process PDF file'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        patient = Patient.objects.create(
            name=request.data['name'],
            plan_text=plan_text
        )
        
        providers_data = request.data.get('providers', [])
        if isinstance(providers_data, str):
            import json
            providers_data = json.loads(providers_data)
            
        for provider_data in providers_data:
            provider = Provider.objects.create(**provider_data)
            PatientProvider.objects.create(patient=patient, provider=provider)
            
        return Response({
            'id': patient.id,
            'plan_text': plan_text[:200] + '...'  # Preview of extracted text
        }, status=status.HTTP_201_CREATED)


    @action(detail=True, methods=['get'])
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
        checkups = Checkup.objects.filter(patient=patient).prefetch_related('modules')
        serializer = CheckupListSerializer(checkups, many=True)
        return Response(serializer.data)

class CheckupViewSet(viewsets.ViewSet):
    """
    API endpoints for managing checkups
    """
    @action(detail=True, methods=['post'])
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
        checkup.completed_at = request.data['completed_at']
        checkup.save()
        return Response(status=status.HTTP_200_OK)

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
        for field in ['outputs', 'status', 'transcript']:
            if field in request.data:
                setattr(module, field, request.data[field])
        module.save()
        return Response(status=status.HTTP_200_OK)