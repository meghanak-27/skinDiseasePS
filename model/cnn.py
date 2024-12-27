import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from flask import Flask, request, jsonify
from PIL import Image
import io
import numpy as np

# Define image dimensions
IMG_HEIGHT = 128
IMG_WIDTH = 128

# PyTorch data augmentation and preprocessing
transform = transforms.Compose([
    transforms.Resize((IMG_HEIGHT, IMG_WIDTH)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# Directories for training and validation data
train_dir = 'dataset/train_set'
validation_dir = 'dataset/test_set'

train_dataset = datasets.ImageFolder(train_dir, transform=transform)
validation_dataset = datasets.ImageFolder(validation_dir, transform=transform)

train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=32, shuffle=True)
validation_loader = torch.utils.data.DataLoader(validation_dataset, batch_size=32, shuffle=False)

# Define the CNN model
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

num_classes = len(train_dataset.classes)
model = CNN(num_classes)

# Define loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Training loop
epochs = 10
for epoch in range(epochs):
    model.train()
    running_loss = 0.0
    for images, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f"Epoch {epoch+1}/{epochs}, Loss: {running_loss/len(train_loader)}")

# Save the model
torch.save(model.state_dict(), 'skin_disease_cnn_model.pth')
