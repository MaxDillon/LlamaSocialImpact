import PyPDF2
from io import BytesIO

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