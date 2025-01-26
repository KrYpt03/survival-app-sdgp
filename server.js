// server.js

// 1) Require dependencies
const express = require('express');
const axios = require('axios');     // Make sure you have installed axios
const multer = require('multer');   // Make sure you have installed multer

// 2) Initialize Express
const app = express();

console.log("Starting the server...");

// Basic test route
app.get('/', (req, res) => {
  res.send('Hello from Fruit Identifier!');
  console.log("A request was received on the root route!");
});

// 3) Configure Multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// 4) Create the /identify endpoint
app.post('/identify', upload.single('plantImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Convert the image to Base64
    const base64Image = req.file.buffer.toString('base64');

    // Build the request body for Plant.id
    const requestBody = {
      images: [base64Image],
    };

    const plantIdUrl = 'https://api.plant.id/v3/identification';

    // Plant.id API key
    const PLANT_ID_API_KEY = 'AM0WS9LPsq4eT5Z8KHn85c0uVhHH3BtfHtLH7BYbHGrAJ0Dojd';

    // Make the POST request to Plant.id
    const response = await axios.post(plantIdUrl, requestBody, {
      headers: {
        'Api-Key': PLANT_ID_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response from Plant.id API: ', response.data);

    // Extract the classification suggestions
    const suggestions = response.data.result?.classification?.suggestions;

    if (!suggestions || suggestions.length === 0) {
      return res.status(200).json({ message: 'No plant suggestions found.' });
    }

    // Extract the best suggestion
    const bestSuggestion = suggestions[0];
    console.log('Best suggestion:', bestSuggestion); // Log suggestion for debugging

    const name = bestSuggestion?.name || 'Unknown plant';
    const probability = bestSuggestion?.probability || 0;
    const common_names = bestSuggestion?.common_names || [];
    const description = bestSuggestion?.details?.description || 'No description available';
    const edible_parts = bestSuggestion?.details?.edible_parts || [];
    const url = bestSuggestion?.url || 'No reference URL available';

    // Prepare result
    const result = {
      identifiedPlant: name,
      confidence: probability,
      commonNames: common_names,
      description,
      edibleParts: edible_parts,
      referenceURL: url,
    };

    return res.status(200).json(result);

  } catch (error) {
    if (error.response) {
      console.error('Error identifying plant:', error.response.data);
    } else {
      console.error('Error identifying plant:', error.message);
    }
    return res.status(500).json({
      error: 'Something went wrong with the identification process.',
    });
  }
});

// 5) Set the port and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
