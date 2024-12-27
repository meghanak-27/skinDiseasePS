const chatbotButton = document.getElementById('chatbotButton');
const chatbox = document.getElementById('chatbox');
const closeChatbox = document.getElementById('closeChatbox');

chatbotButton.addEventListener('click', () => {
    chatbox.style.display = 'block';  // Open chatbox
});

closeChatbox.addEventListener('click', () => {
    chatbox.style.display = 'none';  // Close chatbox
});

// Send Message to Server (Cohere API or other chatbot API)
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatboxBody = document.getElementById('chatboxBody');

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        // Show user message in the chatbox
        chatboxBody.innerHTML += `<div class="user-message">${userMessage}</div>`;
        userInput.value = '';  // Clear input field

        // Call the backend API to get a response from the chatbot
        const response = await fetch('/ask-chatbot/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })  // Send message as 'message'
        });

        const data = await response.json();

        // Handle the response from the backend
        const botMessage = data.response || "I'm sorry, I didn't understand that.";

        // Show bot's response in the chatbox
        chatboxBody.innerHTML += `<div class="bot-message">${botMessage}</div>`;
        chatboxBody.scrollTop = chatboxBody.scrollHeight;  // Scroll to the latest message
    }
});
