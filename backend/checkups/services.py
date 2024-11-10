import time
from typing import List
from checkups.models import Checkup, CheckupModule
from vapi import AssistantOverrides, Vapi, CreateCustomerDto
import os

vapi = Vapi(token=os.getenv("VAPI_API_KEY"))

def trigger_call(patient, checkup: Checkup):
    """Trigger a VAPI call for a specific checkup"""
    checkup_modules: List[CheckupModule] = checkup.modules.all().order_by('sequence_order')
    
    # Build the modules section of the prompt
    modules_text = ""
    for i, module in enumerate(checkup_modules, 1):
        modules_text += f"""
    --- Module {i}: {module.module_type} ---
    Purpose: {module.rationale}
    Details to check: {module.inputs}
    - Ask specific questions about these details only
    - If patient goes off-topic, use the redirection response
    <wait for response after each question>
    """

    prompt = f"""
    [Identity]
    You are a caring healthcare follow-up assistant conducting a structured checkup call.
    
    [Style]
    - Be warm and empathetic but professional
    - Keep questions concise and clear
    - Use natural, conversational language
    - Spell out numbers for more natural speech
    
    [Core Rules]
    - Strictly stick to the provided health check-in topics
    - If the patient goes off-topic, respond with empathy but redirect:
      "I understand that's important to you. I'll make sure to inform your healthcare provider about this. For now, let's focus on [current topic] to complete your check-in."
    - Do not provide medical advice
    - Do not discuss topics outside the specified modules
    
    [Response Guidelines]
    - Wait for patient responses before moving to next topic
    - Acknowledge patient responses before moving on
    - For off-topic concerns: note them, promise to relay to healthcare provider, then return to check-in topics
    - If patient persists with off-topic discussion, politely remind them of the call's purpose
    
    [Task]
    1. Greet {{patient_name}} warmly and identify yourself as their healthcare follow-up assistant
    2. Explain: "I'm calling to do a specific health check-in about your care plan from {{days_since_start}} days ago. I'll be asking you about a few particular topics."
    <wait for acknowledgment>
    
    3. For each module, follow these steps:
    {modules_text}
    
    4. Conclude: "Thank you for answering these specific questions. I'll make sure to relay any additional concerns you mentioned to your healthcare provider."
    5. End the call
    """

    try:
        call = vapi.calls.create(
            assistant_id=os.getenv("VAPI_ASSISTANT_ID"),
            phone_number_id=os.getenv("VAPI_PHONE_NUMBER_ID"),
            customer=CreateCustomerDto(
                name=patient.name,
                number=patient.phone,
            ),
            assistant_overrides=AssistantOverrides(
                system_prompt=prompt,
                variable_values={
                    "patient_name": patient.name,
                    "days_since_start": (checkup.scheduled_for - patient.created_at).days,
                }
            )
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

