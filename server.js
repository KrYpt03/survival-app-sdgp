

// Dependencies
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const multer = require('multer');


const app = express();
console.log("Starting the server...");

// Configure Multer to store uploaded files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Plant.id API key
const PLANT_ID_API_KEY = process.env.API_KEY;

if (!PLANT_ID_API_KEY) {
  console.error("API key is missing!");
  process.exit(1); 
}


// identify endpoint
app.post('/identify', upload.single('plantImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Converting the image to Base64
    const base64Image = req.file.buffer.toString('base64');

    // API request: Identify the plant
    const identificationRequestBody = {
      images: [base64Image],
      similar_images: true 
    };

    const plantIdUrl = 'https://api.plant.id/v3/identification';

    const identificationResponse = await axios.post(plantIdUrl, identificationRequestBody, {
      headers: {
        'Api-Key': PLANT_ID_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log('Response from Plant.id API:', identificationResponse.data);

    // Extract classification suggestions
    const suggestions = identificationResponse.data.result?.classification?.suggestions;

    if (!suggestions || suggestions.length === 0) {
      return res.status(200).json({ message: 'No plant suggestions found.' });
    }

    // Extract the best suggestion
    const bestSuggestion = suggestions[0];
    console.log('Best suggestion:', bestSuggestion);

    const name = bestSuggestion?.name || 'Unknown plant';
    const probability = bestSuggestion?.probability || 0;

    // Check if details exist in bestSuggestion
    const details = bestSuggestion.details || {};
    const description = details.description || "No description available";
    const edible_parts = details.edible_parts || [];
    const common_names = details.common_names || [];
    const referenceURL = details.url || "No reference URL available";

    //  result
    const result = {
      identifiedPlant: name,
      confidence: probability,
      commonNames: common_names,
      description,
      edibleParts: edible_parts,
      referenceURL,
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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
