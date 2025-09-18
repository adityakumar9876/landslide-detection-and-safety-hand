const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create Lex runtime client
const lexRuntime = new AWS.LexRuntimeV2();

// Route to handle chat messages
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    const params = {
      botId: process.env.LEX_BOT_ID, // Your Lex bot ID
      botAliasId: process.env.LEX_BOT_ALIAS_ID, // Your Lex bot alias ID
      localeId: 'en_US',
      sessionId: sessionId || 'default-session',
      text: message
    };

    // Send message to Lex
    const response = await lexRuntime.recognizeText(params).promise();
    
    // Extract the response message
    const messages = response.messages || [];
    const botMessage = messages.length > 0 ? messages[0].content : 'Sorry, I did not understand that.';

    res.json({
      message: botMessage,
      sessionId: params.sessionId
    });
  } catch (error) {
    console.error('Error communicating with Lex:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Route to get risk data (simulated)
app.get('/api/risk-data', (req, res) => {
  // In a real application, this would fetch data from sensors or databases
  const riskData = {
    riskLevel: Math.floor(Math.random() * 100),
    temperature: Math.round(15 + Math.random() * 10),
    precipitation: Math.round(Math.random() * 100),
    windSpeed: Math.round(5 + Math.random() * 30),
    slopeAngle: Math.round(20 + Math.random() * 40),
    snowDepth: Math.round(Math.random() * 200)
  };
  
  res.json(riskData);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});