import time
from typing import List
from checkups.models import Checkup, CheckupModule
from vapi import AssistantOverrides, Vapi, CreateCustomerDto
import os

vapi = Vapi(token=os.getenv("VAPI_API_KEY"))

def trigger_call(patient, checkup: Checkup):
    """Trigger a VAPI call for a specific checkup"""
    checkup_modules : List[CheckupModule] = checkup.modules.all()
    print(checkup_modules)
    for module in checkup_modules:
        print(module.module_type)
    # Create the call
    try:
        call = vapi.calls.create(
            phone_number_id=os.getenv("VAPI_PHONE_NUMBER_ID"),
            assistant_id=os.getenv("VAPI_ASSISTANT_ID"),
            customer=CreateCustomerDto(
                name=patient.name,
                number=patient.phone,  # You'll need to add this field to Patient model
            ),
            assistant_overrides=AssistantOverrides(
                variable_values={
                    "patient_name": patient.name,
                    "patient_phone": patient.phone,  # You'll need to add this field
                    "patient_plan": patient.plan_text,
                    "days_since_start": (checkup.scheduled_for - patient.created_at).days,
                }
            ),
        )
        while True:
            call_status = vapi.calls.get(call.id)
            if call_status.status == "ended":
                break
            time.sleep(1)
            print(call_status.status)
        return call
    except Exception as e:
        print(f"Error triggering call: {e}")
        raise