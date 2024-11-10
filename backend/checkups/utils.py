import PyPDF2
from io import BytesIO
from together import Together
import os, json
import plan_process_types
from dotenv import load_dotenv
import openai


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
PARSE_PROMPT = f"The following is a set of instructions for patient care. Give me a list of all actionable tasks split into checkins. Give me it in json form. Here is the jaon schema: {JSON_SCHEMA}"
load_dotenv()


def extract_information_from_document(document: str):
    togetherai = Together(api_key=os.environ.get("TOGETHER_AI_KEY"))
    client = openai.OpenAI(
        base_url="https://api.fireworks.ai/inference/v1",
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

    return plan_process_types.PlanProcessingPlan.model_validate_json(
        response.choices[0].message.content
    )
