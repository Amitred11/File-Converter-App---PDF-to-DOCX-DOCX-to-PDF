function analyzeFile() {
    const fileInput = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");
    const convertSection = document.getElementById("convertSection");
    const detectedFormat = document.getElementById("detectedFormat");

    if (fileInput.files.length === 0) {
        convertSection.classList.add("hidden");
        fileNameDisplay.innerText = "";
        return;
    }

    const file = fileInput.files[0];
    const fileType = file.name.split(".").pop().toLowerCase();

    if (fileType !== "pdf" && fileType !== "docx") {
        fileNameDisplay.innerText = "❌ Invalid file type! Please upload a PDF or DOCX.";
        fileNameDisplay.style.color = "red";
        convertSection.classList.add("hidden");
        return;
    }

    fileNameDisplay.style.color = "black";
    fileNameDisplay.innerText = `📄 Selected File: ${file.name}`;
    detectedFormat.innerText = fileType.toUpperCase();
    convertSection.classList.remove("hidden");
}

function convertFile() {
    const fileInput = document.getElementById("fileInput");
    const formatSelect = document.getElementById("formatSelect");
    const statusText = document.getElementById("status");
    const loadingOverlay = document.getElementById("loadingOverlay");

    if (fileInput.files.length === 0) {
        statusText.innerText = "❌ Please select a file to convert.";
        statusText.style.color = "red";
        return;
    }

    const file = fileInput.files[0];
    const selectedFormat = formatSelect.value;
    const originalExtension = file.name.split(".").pop().toLowerCase();

    if (originalExtension === selectedFormat) {
        statusText.innerText = "⚠️ File is already in the selected format.";
        statusText.style.color = "orange";
        return;
    }

    // Show Uploading Message
    statusText.innerText = "⏳ Uploading file...";
    statusText.style.color = "blue";
    loadingOverlay.classList.remove("hidden");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("format", selectedFormat);

    fetch("http://127.0.0.1:5000/convert", {
        method: "POST",
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Server error");
        }
        return response.blob();
    })
    .then(blob => {
        const convertedFileName = file.name.replace(/\.[^/.]+$/, "") + "." + selectedFormat;
        const fileURL = URL.createObjectURL(blob);
        
        // Hide Uploading Message
        statusText.innerText = "";
        loadingOverlay.classList.add("hidden");

        showDownloadPopup(convertedFileName, selectedFormat, fileURL);
    })
    .catch(error => {
        statusText.innerText = "❌ Conversion failed!";
        statusText.style.color = "red";
        loadingOverlay.classList.add("hidden");
        console.error(error);
    });
}

function showDownloadPopup(fileName, format, fileURL) {
    const popup = document.createElement("div");
    popup.id = "conversionPopup"; // Add ID for reference
    popup.classList.add("fixed", "inset-0", "bg-black", "bg-opacity-50", "flex", "items-center", "justify-center");

    popup.innerHTML = `
    <div class="bg-white p-6 rounded-2xl shadow-xl text-center w-80 max-w-full">
        <p class="text-xl font-semibold text-green-600 flex items-center justify-center">
            ✅ Conversion Complete!
        </p>
        <p class="mt-3 text-gray-700 text-lg font-medium">
            <span class="font-semibold">File:</span> ${fileName}
        </p>
        <p class="mt-1 text-gray-600 text-sm">
            Converted to <span class="font-semibold">${format.toUpperCase()}</span>.
        </p>
        
        <!-- Download Button -->
        <a href="${fileURL}" download="${fileName}"
            class="mt-5 block w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-all">
            ⬇ Download File
        </a>

        <!-- Close Button -->
        <button onclick="closePopup()" 
            class="mt-3 text-red-500 font-medium hover:text-red-600 transition-all">
            ✖ Close
        </button>
    </div>
    `;

    document.body.appendChild(popup);
}

function closePopup() {
    const popup = document.getElementById("conversionPopup");
    if (popup) {
        popup.remove(); // Properly remove the popup
    }
}

