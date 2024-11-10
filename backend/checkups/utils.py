import PyPDF2
from io import BytesIO
from together import Together
import os, json
import plan_process_types
from dotenv import load_dotenv
import openai
from .models import CheckupModule
from .serializers import ModuleDetailSerializer


def extract_text_from_pdf(pdf_file):
    """Extract text content from uploaded PDF file"""
    try:
        # Create a BytesIO object from the uploaded file
        pdf_bytes = BytesIO(pdf_file.read())

        # Create PDF reader object
        reader = PyPDF2.PdfReader(pdf_bytes)

        # Extract text from all pages
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        return text
    except Exception as e:
        print(f"Error extracting PDF text: {e}")
        return None


JSON_SCHEMA = plan_process_types.PlanProcessingPlan.model_json_schema()
PARSE_PROMPT = f"""
The following is a set of instructions on the steps needed to be taken for patients/clients to complete their requirements.
You will parse these instructions into this schema:
{JSON_SCHEMA}

Make sure to include as much information and context in the schema as possible. and be as specific as possible.
Fields labeled rationale should be there to explain why this information was inserted and what it represents.
"""
load_dotenv()


def extract_information_from_document(document: str):
    client = openai.OpenAI(
        base_url=os.environ["BASE_URL"],
        api_key=os.environ["FIREWORKS_AI_KEY"],
    )
    response = client.chat.completions.create(
        model="accounts/fireworks/models/llama-v3p1-8b-instruct",
        messages=[
            {
                "role": "system",
                "content": PARSE_PROMPT,
            },
            {
                "role": "user",
                "content": document,
            },
        ],
        response_format={"type": "json_object", "schema": JSON_SCHEMA},
    )

    print(response.choices[0].message.content)

    return plan_process_types.Outputs.model_validate_json(
        response.choices[0].message.content
    )


def verify_module(module: CheckupModule, transcript: str):
    SCHEMA = plan_process_types.Outputs.model_json_schema()
    PROMPT = f"""
    Summarize the results of this specific module from the following transcript. Following is the transcript then the module. 
    Please conform to the schema:
    {SCHEMA}
"""

    client = openai.OpenAI(
        base_url=os.environ["BASE_URL"],
        api_key=os.environ["FIREWORKS_AI_KEY"],
    )
    response = client.chat.completions.create(
        model="accounts/fireworks/models/llama-v3p1-8b-instruct",
        messages=[
            {
                "role": "system",
                "content": PROMPT,
            },
            {
                "role": "user",
                "content": json.dumps(ModuleDetailSerializer(module).data),
            },
            {
                "role": "user",
                "content": transcript,
            },
        ],
        response_format={"type": "json_object", "schema": SCHEMA},
    )

    result = plan_process_types.Outputs.model_validate_json(
        response.choices[0].message.content
    )
    return result
