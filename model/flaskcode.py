from flask import Flask, request, jsonify
import torch
import torch.nn as nn 
from torchvision import transforms
from PIL import Image
import io
import os

# Define image transformation (same as during training)
IMG_HEIGHT = 128
IMG_WIDTH = 128

transform = transforms.Compose([
    transforms.Resize((IMG_HEIGHT, IMG_WIDTH)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])


# Define the CNN model architecture
class CNN(nn.Module):
    def __init__(self, num_classes):
        super(CNN, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3)
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3)
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3)
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        self.fc1 = nn.Linear(128 * 14 * 14, 128)
        self.fc2 = nn.Linear(128, num_classes)

    def forward(self, x):
        x = torch.relu(self.conv1(x))  # Apply ReLU activation after convolution
        x = self.pool(x)
        x = torch.relu(self.conv2(x))  # Apply ReLU activation after convolution
        x = self.pool(x)
        x = torch.relu(self.conv3(x))  # Apply ReLU activation after convolution
        x = self.pool(x)
        x = x.view(-1, 128 * 14 * 14)  # Flatten the output for the fully connected layer
        x = torch.relu(self.fc1(x))  # Apply ReLU activation after fully connected layer
        x = self.fc2(x)  # Output layer
        return x

# Initialize Flask app
app = Flask(__name__)

# Load the trained model
model = CNN(num_classes=8)  # Make sure to use the correct number of classes
model.load_state_dict(torch.load('skin_disease_cnn_model.pth'))  # Load the weights
model.eval()  # Set model to evaluation mode

# Define prediction route
@app.route('/predict', methods=['POST'])
def predict():
    print(request.files)  # Flask

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    try:
        # Read and preprocess the image
        image = Image.open(io.BytesIO(file.read()))
        image = transform(image).unsqueeze(0)  # Add batch dimension

        # Make prediction using the model
        with torch.no_grad():  # Disable gradient calculation
            outputs = model(image)
            _, predicted = torch.max(outputs, 1)
        
        # Retrieve the predicted class label
        class_labels = ['BA- cellulitis','BA-impetigo','FU-athlete-foot','FU-nail-fungus','FU-ringworm','PA-cutaneous-larva-migrans','VI-chickenpox','VI-shingles']  # Replace with your actual class labels
        predicted_label = class_labels[predicted.item()]
        print(f"Predicted label: {predicted_label}") 
        return jsonify({'prediction': predicted_label})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    debug = os.environ.get("DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug)


