from flask import Blueprint, request
from vapi import Vapi
import os
from dotenv import load_dotenv
import PyPDF2
from io import BytesIO

load_dotenv()

routes = Blueprint("call_routes", __name__)

vapi_client = Vapi(
    token=os.environ["VAPI_API_KEY"],
)


@routes.get("/")
def call():
    res = vapi_client.calls.create(
        assistant_id=os.environ["VAPI_ASSISTANT_ID"],
        phone_number_id=os.environ["VAPI_PHONE_NUMBER_ID"],
        customer={"number": "+1(650)305-1830"},
    )
    return res.json()


@routes.post("/upload")
def upload_file():
    try:
        # Check if the post request has the file part
        if "pdf" not in request.files:
            return {"error": "No pdf file provided"}, 400

        file = request.files["pdf"]
        name = request.form.get("name")

        # Validate name
        if not name:
            return {"error": "Name is required"}, 400

        # Validate file selection
        if file.filename == "":
            return {"error": "No selected file"}, 400

        # Read PDF content
        pdf_reader = PyPDF2.PdfReader(BytesIO(file.read()))
        num_pages = len(pdf_reader.pages)

        # Example: Read first page text
        first_page = pdf_reader.pages[0]
        text = first_page.extract_text()
        print(text)
        return {
            "success": True,
            "data": {
                "name": name,
                "filename": file.filename,
                "number_of_pages": num_pages,
                "first_page_text": text,
            },
        }, 200

    except Exception as e:
        return {"success": False, "error": str(e)}, 500
