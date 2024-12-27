document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const fileInput = document.getElementById('imageInput');
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]); // match 'image' instead of 'file'
    // Append the selected file

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log("Response from server:", result);
        if (response.ok) {
            alert(`Prediction: ${result.prediction}`);
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading the file.");
    }
});