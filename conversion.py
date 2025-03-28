from flask import Flask, request, send_file, jsonify, render_template
from pdf2docx import Converter
import os
import subprocess

# Flask App Initialization
app = Flask(__name__, static_folder="static", template_folder="templates")

# Folders for Uploading & Converting Files
UPLOAD_FOLDER = "uploads"
CONVERTED_FOLDER = "converted"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CONVERTED_FOLDER, exist_ok=True)

# PDF to DOCX Conversion
def pdf_to_docx(pdf_path, docx_path):
    try:
        cv = Converter(pdf_path)
        cv.convert(docx_path)
        cv.close()
    except Exception as e:
        print(f"❌ Error converting PDF to DOCX: {e}")

# DOCX to PDF Conversion
def docx_to_pdf(docx_path):
    try:
        libreoffice_path = r"C:\Program Files\LibreOffice\program\soffice.exe"  # Adjust if needed
        subprocess.run(
            [libreoffice_path, "--headless", "--convert-to", "pdf", docx_path, "--outdir", CONVERTED_FOLDER],
            check=True
        )
        return os.path.join(CONVERTED_FOLDER, os.path.basename(docx_path).replace(".docx", ".pdf"))
    except subprocess.CalledProcessError as e:
        print(f"❌ Error converting DOCX to PDF: {e}")
        return None

# Homepage Route
@app.route("/")
def home():
    return render_template("index.html")  # Serves index.html

# File Conversion Route
@app.route("/convert", methods=["POST"])
def convert_file():
    file = request.files.get("file")
    target_format = request.form.get("format")

    if not file or not target_format:
        return jsonify({"error": "Invalid request"}), 400

    original_extension = file.filename.rsplit(".", 1)[-1].lower()
    filename_without_ext = os.path.splitext(file.filename)[0]
    uploaded_path = os.path.join(UPLOAD_FOLDER, file.filename)
    converted_path = os.path.join(CONVERTED_FOLDER, f"{filename_without_ext}.{target_format}")

    # Save the uploaded file
    file.save(uploaded_path)

    # Perform conversion based on file type
    if original_extension == "pdf" and target_format == "docx":
        pdf_to_docx(uploaded_path, converted_path)
    elif original_extension == "docx" and target_format == "pdf":
        converted_path = docx_to_pdf(uploaded_path)  # Updated function call
    else:
        return jsonify({"error": "Unsupported conversion"}), 400

    # Check if conversion succeeded
    if not os.path.exists(converted_path):
        return jsonify({"error": "Conversion failed"}), 500

    return send_file(converted_path, as_attachment=True)

# Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
