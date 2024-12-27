const express = require('express');
const axios = require('axios');
const router = express.Router();

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_API_URL = 'https://api.cohere.ai/generate';

// Function to get response from Cohere API
async function getChatResponse(userMessage) {
    const prompt = `You are a helpful assistant who answers realted to ONLY skin disease. Answer the following question about skin diseases: ${userMessage}`;
    
    try {
        const response = await axios.post(COHERE_API_URL, {
            model: 'command',  // Example model
            prompt: prompt,
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                Authorization: `Bearer ${COHERE_API_KEY}`,
            },
        });
        // Log the entire response

        return response.data.text.trim();
    } catch (error) {
        console.error("Error fetching response from Cohere:", error);
        return "Sorry, I couldn't understand your question. Please try again.";
    }
}

// Define a route for chatbot queries
router.post('/ask', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const chatResponse = await getChatResponse(userMessage);
        return res.json({ response: chatResponse });
    } catch (error) {
        return res.status(500).json({ error: "Failed to get a response from the chatbot" });
    }
});

module.exports = router;
