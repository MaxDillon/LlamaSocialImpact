import time
from typing import List
from checkups.models import Checkup, CheckupModule
from vapi import AssistantOverrides, Vapi, CreateCustomerDto
import os
from jinja2 import Environment, FileSystemLoader

vapi = Vapi(token=os.getenv("VAPI_API_KEY"))


def trigger_call(patient, checkup: Checkup):
    try:
        """Trigger a VAPI call for a specific checkup"""
        checkup_modules: List[CheckupModule] = checkup.modules.all()
        print(checkup_modules)
        for module in checkup_modules:
            print(module.module_type)

        # Load and render call plan template
        env = Environment(loader=FileSystemLoader("checkups/templates"))
        template = env.get_template("call_plan.njk")
        call_plan = template.render(checkup=checkup)
    except Exception as e:
        print(f"Error rendering call plan: {e}")
        raise
    print(os.getenv("VAPI_ASSISTANT_ID"))
    print(call_plan)
    # Create the call
    try:
        call = vapi.calls.create(
            assistant_id=os.getenv("VAPI_ASSISTANT_ID"),
            phone_number_id=os.getenv("VAPI_PHONE_NUMBER_ID"),
            customer=CreateCustomerDto(
                name=patient.name,
                number=patient.phone,
            ),
            assistant_overrides=AssistantOverrides(
                variable_values={
                    "patient_name": patient.name,
                    "days_since_start": (
                        checkup.scheduled_for - patient.created_at
                    ).days,
                    "call_plan": call_plan,
                }
            ),
        )

        while True:
            call_status = vapi.calls.get(call.id)
            if call_status.status == "ended":
                break
            time.sleep(1)
            print(call_status.status)

        print(call_status.transcript)
        return (call, call_status)
    except Exception as e:
        print(f"Error triggering call: {e}")
        raise
