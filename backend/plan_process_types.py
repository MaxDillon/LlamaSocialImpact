from pydantic import BaseModel, Field
from typing import List, Literal, Union
from enum import Enum
from datetime import datetime


class DayOfWeek(int, Enum):
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6


class PlanProcessingModuleType(str, Enum):
    CHECKIN = "checkin_requirement"
    OUTREACH = "outreach_check"
    DOCUMENTATION = "documentation_status"
    MEDICATION = "medication_adherence"
    NEEDS = "needs_verification"


class PlanProcessingProviderType(str, Enum):
    CASE_MANAGER = "case_manager"
    PRIMARY_CARE = "primary_care"
    MENTAL_HEALTH = "mental_health"
    HOUSING = "housing_coordinator"
    CRISIS = "crisis_team"
    SHELTER = "shelter_staff"


class PlanProcessingPriority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


# Base configs
class PlanProcessingCheckinRequirementConfig(BaseModel):
    location: str
    timeWindow: str
    frequency: str


class PlanProcessingOutreachCheckConfig(BaseModel):
    serviceName: str
    purpose: str
    contact: str
    requirements: List[str] = []


class PlanProcessingDocumentationStatusConfig(BaseModel):
    category: str
    required: List[str]
    deadline: str | None = None


class PlanProcessingMedicationAdherenceConfig(BaseModel):
    frequency: str
    timeOfDay: str
    storage: str | None = None


class PlanProcessingNeedsVerificationConfig(BaseModel):
    needType: str
    schedule: str
    location: str | None = None


class PlanProcessingAlertThreshold(BaseModel):
    provider: PlanProcessingProviderType
    rationale: str
    condition: str


# Module with specific configs
class PlanProcessingCheckinModule(BaseModel):
    moduleType: Literal[PlanProcessingModuleType.CHECKIN]
    moduleConfig: PlanProcessingCheckinRequirementConfig
    priority: PlanProcessingPriority
    alertThresholds: List[PlanProcessingAlertThreshold]


class PlanProcessingOutreachModule(BaseModel):
    moduleType: Literal[PlanProcessingModuleType.OUTREACH]
    moduleConfig: PlanProcessingOutreachCheckConfig
    priority: PlanProcessingPriority
    alertThresholds: List[PlanProcessingAlertThreshold]


class PlanProcessingDocumentationModule(BaseModel):
    moduleType: Literal[PlanProcessingModuleType.DOCUMENTATION]
    moduleConfig: PlanProcessingDocumentationStatusConfig
    priority: PlanProcessingPriority
    alertThresholds: List[PlanProcessingAlertThreshold]


class PlanProcessingMedicationModule(BaseModel):
    moduleType: Literal[PlanProcessingModuleType.MEDICATION]
    moduleConfig: PlanProcessingMedicationAdherenceConfig
    priority: PlanProcessingPriority
    alertThresholds: List[PlanProcessingAlertThreshold]


class PlanProcessingNeedsModule(BaseModel):
    moduleType: Literal[PlanProcessingModuleType.NEEDS]
    moduleConfig: PlanProcessingNeedsVerificationConfig
    priority: PlanProcessingPriority
    alertThresholds: List[PlanProcessingAlertThreshold]


# Main models
class PlanProcessingCheckIn(BaseModel):
    day_of_week: DayOfWeek = Field(ge=0, le=6)
    description: str
    rationale: str
    modules: List[
        Union[
            PlanProcessingCheckinModule,
            PlanProcessingOutreachModule,
            PlanProcessingDocumentationModule,
            PlanProcessingMedicationModule,
            PlanProcessingNeedsModule,
        ]
    ]


class PlanProcessingPlan(BaseModel):
    patientName: str
    caseNumber: str
    checkIns: List[PlanProcessingCheckIn]
