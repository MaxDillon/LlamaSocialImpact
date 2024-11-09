import PyPDF2

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text

pdf_path = "test_pdf1.pdf"
pdf_text = extract_text_from_pdf(pdf_path)

print(pdf_text)