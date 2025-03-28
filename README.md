# 📄 File Converter App - PDF to DOCX & DOCX to PDF

A simple web-based file converter that allows users to convert PDF files to DOCX and DOCX files to PDF. Built using **Flask (Python)** for backend processing and **JavaScript** for client-side interactions.

## 🚀 Features
✅ Convert PDF to DOCX  
✅ Convert DOCX to PDF  
✅ Clean and responsive UI  
✅ Error handling for invalid files  
✅ Download converted files instantly  

## 🛠️ Technologies Used
- **Backend:** Flask (Python)
- **Frontend:** HTML, CSS, JavaScript (TailwindCSS)
- **File Processing:** pdf2docx, LibreOffice CLI

## 📦 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Amitred11/file-converter-app.git
cd file-converter-app
```

### 2️⃣ Install Dependencies  
Ensure you have **Python 3.12+** installed. Then, install the required packages:
```bash
pip install flask pdf2docx
```

For **DOCX to PDF conversion**, ensure **LibreOffice** is installed and add it to the system path.

### 3️⃣ Run the App
```bash
python app.py
```
The app will start at `http://127.0.0.1:5000/`.

## 🖥️ Usage
1. Upload a **PDF or DOCX** file.
2. Select the target format (**PDF or DOCX**).
3. Click **Convert** and download the converted file.

## ⚠️ Troubleshooting
- If you encounter a **WinError 2** in `subprocess.run`, check that **LibreOffice** is installed and accessible via `soffice` in the command line.
- Ensure `uploads` and `converted` folders exist in the project directory.

## 📝 License
This project is **open-source** under the **MIT License**.
