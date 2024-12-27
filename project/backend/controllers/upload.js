const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Configure multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

async function uploadImage(req, res) {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        console.log(file); // Log file details from Multer

        // Read the file as a stream
        const filePath = path.join(__dirname, '../../', file.path);
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), file.originalname);

        // Send the file to Flask API for prediction
      

        const response = await axios.post('https://p21-sd-flask.onrender.com', formData, {
            headers: formData.getHeaders(), // Attach FormData headers
        });
        console.log('Uploaded file path:', filePath);  // Log this to verify the path


        // Get the prediction result from Flask
        const prediction = response.data.prediction;

        // Render the  prediction to the 'upload' view
        return res.json({ prediction });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server error while processing image' });
    } finally {
        // Clean up uploaded file from the server
        if (req.file) {
            fs.unlink(path.join(__dirname, '../../', req.file.path), (err) => {
                if (err) console.error('Error cleaning up uploaded file:', err);
            });
        }
    }
}

module.exports = {
    upload,
    uploadImage,
};
