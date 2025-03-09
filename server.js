require("dotenv").config();
const express = require("express");
const multer = require("multer"); // For handling multipart/form-data (file uploads)
const axios = require("axios"); // For making HTTP requests
const fs = require("fs");
const cors = require("cors"); // For enabling Cross Origin Resource Sharing 

const app = express();
const port = process.env.PORT || 5000;
const KINDWISE_API_KEY ="AM0WS9LPsq4eT5Z8KHn85c0uVhHH3BtfHtLH7BYbHGrAJ0Dojd" ;
const KINDWISE_URL = "https://plant.id/api/v3/identification";

app.use(cors()); // Enable cross-origin requests

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, "uploads/"); // Save images to 'uploads' folder
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

//POST Endpoint to Identify a Plant
app.post("/identify", upload.single("image"), async (req, res) => {
  try {
      if (!req.file) return res.status(400).json({ error: "Image file is required" });

      const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

      // Define API URL
      const API_URL = "https://plant.id/api/v3/identification";

      // Prepare request payload
      const requestData = {
          images: [imageBase64],
          classification_level: "species",
          similar_images: true,
          health: "auto"
      };

// Send request to Kindwise API
const response = await axios.post(API_URL, requestData, {
  headers: {
      "Content-Type": "application/json",
      "Api-Key": KINDWISE_API_KEY
  }
});

if (!response.data.access_token) {
  return res.status(500).json({ error: "No access_token received from API" });
}
const accessToken = response.data.access_token;


} catch (error) {
  console.error("API Error:", error.response ? error.response.data : error.message);
  res.status(500).json({ error: error.response ? error.response.data : "Unknown error" });
}
});
  



// ✅ Start the Server
app.listen(port, () => {
console.log(`✅ Server running on port ${port}`);
});
