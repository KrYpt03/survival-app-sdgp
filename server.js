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

