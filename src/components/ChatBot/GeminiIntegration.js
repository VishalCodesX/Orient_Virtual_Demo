// src/components/ChatBot/GeminiIntegration.js

// Gemini API Integration with better error handling
export const queryGeminiAPI = async (message) => {
  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not configured');
    throw new Error('API key not configured');
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `You are a helpful assistant for Orient Solutions, a company that sells RAPTOR interactive panels and KYOCERA printers. 

Company Context:
- Orient Solutions specializes in educational technology and office printing solutions
- RAPTOR panels are interactive displays for classrooms and meeting rooms (65", 75", 86" sizes)
- KYOCERA printers include TASKalfa and ECOSYS series
- We offer AR visualization features for RAPTOR panels
- Professional installation and training included
- Contact: +91 98409 09409, sales@orientsolutions.com

User Question: "${message}"

Please provide a helpful, concise response (max 150 words) that:
1. Answers their question professionally
2. Relates to our products when relevant
3. Suggests contacting sales for pricing/demos when appropriate
4. Maintains a friendly, knowledgeable tone

If the question is completely unrelated to our business, politely redirect to our product offerings.`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 200,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API HTTP ${response.status}:`, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error('Invalid Gemini API response format:', data);
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API Error Details:', error);
    
    // More specific error handling
    if (error.message.includes('API key')) {
      throw new Error('API configuration issue');
    } else if (error.message.includes('network') || error.name === 'TypeError') {
      throw new Error('Network connection issue');
    } else {
      throw new Error('AI service temporarily unavailable');
    }
  }
};