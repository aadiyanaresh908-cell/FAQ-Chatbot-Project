const express = require('express');
const cors = require('cors');
const { tavily } = require("@tavily/core");

const app = express();
app.use(express.json());
app.use(cors()); // Critical: This allows your React app to talk to this server

// Use the API key you provided
const tvly = tavily({ apiKey: "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" }); 

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  console.log("Received message:", message); // Check your terminal to see this reflect

  try {
    const searchResult = await tvly.search(message, {
      searchDepth: "advanced",
      includeAnswer: true, // Forces a detailed technical answer
      maxResults: 3
    });

    const detailedAnswer = searchResult.answer || (searchResult.results[0]?.content);

    if (detailedAnswer) {
      res.json({ answer: detailedAnswer });
    } else {
      console.log(`Requirement 11 - Knowledge Gap: ${message}`); //
      res.json({ answer: "I searched the web but couldn't find a specific answer. I've logged this for review!" });
    }
  } catch (error) {
    console.error("Tavily API Error:", error.message);
    res.status(500).json({ answer: "Backend connection error. Check your API key status." });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));