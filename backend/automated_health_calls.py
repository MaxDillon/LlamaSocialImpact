# This is a script that combines call_routes.py and together_ai.py to create a full automated health call.
from flask import Blueprint
import os
from together import Together
from vapi import Vapi
from pydantic import BaseModel, Field
import json
from dotenv import load_dotenv

load_dotenv()

health_routes = Blueprint("health_routes", __name__)

# Initialize clients
together_client = Together(api_key=os.environ.get("TOGETHER_AI_KEY"))
vapi_client = Vapi(token=os.environ["VAPI_API_KEY"])

class BuildingBlock(BaseModel):
    name: str
    description: str    

class CheckIn(BaseModel):
    blocks: list[BuildingBlock] = Field(
        description="an actionable task the client should take by this check-in time"
    )

class Result(BaseModel):
    check_ins: list[CheckIn] = Field(description="check-ins")

@health_routes.post("/initiate-health-call")
def initiate_health_call():
    # Get the care instructions (you might want to pass this as a parameter)
    with open("/Users/maxdillon/Projects/hackathons/llama_impact/LlamaSocialImpact/example_documents.txt") as f:
        care_instructions = f.read()

    # Get structured check-ins from Together AI
    response = together_client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        messages=[
            {
                "role": "system",
                "content": "The following is a set of instructions for patient care. Give me a list of all actionable tasks split into checkins. Give me it in json form.",
            },
            {
                "role": "user",
                "content": care_instructions,
            },
        ],
        response_format={"type": "json_object", "schema": Result.model_json_schema()},
    )
    
    checkins = json.loads(response.choices[0].message.content)
    
    # Format check-ins for the call script
    formatted_checkins = ""
    for i, checkin in enumerate(checkins['check_ins'], 1):
        formatted_checkins += f"\nCheck-in {i}:\n"
        for block in checkin['blocks']:
            formatted_checkins += f"- {block['name']}: {block['description']}\n"

    # Generate call script
    script_response = together_client.chat.completions.create(
        model="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a healthcare coordinator making a phone call to a patient. Create a natural, conversational script for discussing these check-in items. Be warm and professional, and make sure to cover all points clearly.",
            },
            {
                "role": "user",
                "content": f"Create a phone call script to discuss these check-ins with the patient: {formatted_checkins}",
            },
        ]
    )
    
    call_script = script_response.choices[0].message.content

    # Initiate call with VAPI
    call_response = vapi_client.calls.create(
        assistant_id=os.environ["VAPI_ASSISTANT_ID"],
        phone_number_id=os.environ["VAPI_PHONE_NUMBER_ID"],
        customer={"number": "+1(650)305-1830"}, 
    )

    return {
        "status": "success",
        "call_details": call_response.json(),
        "script": call_script,
        "checkins": checkins
    } 