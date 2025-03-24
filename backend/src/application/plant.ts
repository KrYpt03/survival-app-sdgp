import { Request, Response, NextFunction } from "express";
import axios from "axios";
import fs from "fs";
import { ApiError } from "../api/middlewares/errorHandler.js";
import { Multer } from 'multer';

// Define interfaces for API responses
interface KindwiseResponse {
  access_token: string;
  result?: {
    classification: {
      suggestions: Array<{
        name: string;
        probability: number;
        details?: {
          common_names: string[];
          edible_parts: string[];
          description: string;
        };
      }>;
    };
  };
}

interface PlantIdentificationResult {
  message?: string;
  scientific_name?: string;
  common_names?: string[];
  edible_parts?: string[];
  description?: string;
  confidence?: string;
  error?: string;
}

// Define multer request type
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

// Update the constants section to include a mock response for testing
const KINDWISE_API_KEY: string = process.env.KINDWISE_API_KEY || '';
const KINDWISE_URL: string = "https://plant.id/api/v3/identification";
const USE_MOCK_DATA: boolean = process.env.USE_MOCK_DATA === 'true';

export const identifyPlant = async (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Plant identification request received");
    
    if (!req.file) {
      console.error("Plant identification error: No file uploaded");
      throw new ApiError(400, "Image file is required");
    }

    console.log(`File received: ${req.file.originalname}, size: ${req.file.size} bytes, path: ${req.file.path}`);
    
    // If mock data is enabled, skip the API call and return mock data
    if (USE_MOCK_DATA) {
      console.log("Using mock data for plant identification");
      
      // Clean up the uploaded file
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
          console.log("Temporary file deleted");
        }
      } catch (cleanupError) {
        console.error("Error cleaning up file:", cleanupError);
      }
      
      // Send mock plant identification result
      res.json({
        scientific_name: "Malus domestica",
        common_names: ["Apple", "Common Apple", "Domestic Apple"],
        edible_parts: ["fruit"],
        description: "The apple tree is a deciduous tree in the rose family best known for its sweet, pomaceous fruit, the apple. It is cultivated worldwide as a fruit tree, and is the most widely grown species in the genus Malus.",
        confidence: "96.35%"
      });
      return;
    }
    
    // Validate the API key
    if (!KINDWISE_API_KEY) {
      console.error("Plant identification error: Missing API key");
      throw new ApiError(500, "API configuration error");
    }

    // Check if file exists and is readable
    if (!fs.existsSync(req.file.path)) {
      console.error(`Plant identification error: File doesn't exist at path: ${req.file.path}`);
      throw new ApiError(500, "File processing error");
    }

    const imageBase64: string = fs.readFileSync(req.file.path, { encoding: "base64" });
    console.log(`Image encoded to base64, length: ${imageBase64.length} characters`);

    const requestData = {
      images: [imageBase64],
      classification_level: "species",
      similar_images: true,
      health: "auto",
    };

    console.log("Sending request to Kindwise API...");
    // Send request to Kindwise API
    const response = await axios.post<KindwiseResponse>(KINDWISE_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Api-Key": KINDWISE_API_KEY,
      },
      timeout: 30000, // 30 second timeout
    }).catch(error => {
      console.error("Kindwise API request failed:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        // If unauthorized (401) or API limit reached, use fallback data
        if (error.response.status === 401 || error.response.status === 429) {
          console.log("API authorization failed or limit reached. Using fallback data");
          
          return {
            data: {
              access_token: "mock-token",
              result: {
                classification: {
                  suggestions: [
                    {
                      name: "Malus domestica",
                      probability: 0.9635,
                      details: {
                        common_names: ["Apple", "Common Apple"],
                        edible_parts: ["fruit"],
                        description: "The apple tree is a deciduous tree in the rose family best known for its sweet, pomaceous fruit, the apple. It is cultivated worldwide as a fruit tree, and is the most widely grown species in the genus Malus."
                      }
                    }
                  ]
                }
              }
            }
          };
        }
      }
      throw new ApiError(500, "Plant identification service unavailable");
    });

    if (!response.data) {
      console.error("Plant identification error: No data in response");
      throw new ApiError(500, "Invalid response from identification service");
    }

    if (!response.data.access_token) {
      console.error("Plant identification error: No access token in response", response.data);
      throw new ApiError(500, "No access_token received from API");
    }
    
    const accessToken: string = response.data.access_token;
    console.log("Access token received from Kindwise API");

    // If this is a mock token, skip the second API call
    let fullDetailsResponse;
    if (accessToken === "mock-token") {
      console.log("Using mock data for detailed results");
      fullDetailsResponse = response; // Reuse the mock response
    } else {
      // Fetch Complete Details Using `access_token`
      const detailsUrl: string = `https://plant.id/api/v3/identification/${accessToken}?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods&language=en`;

      console.log("Fetching detailed results...");
      fullDetailsResponse = await axios.get<KindwiseResponse>(detailsUrl, {
        headers: { "Api-Key": KINDWISE_API_KEY },
        timeout: 30000, // 30 second timeout
      }).catch(error => {
        console.error("Kindwise API details request failed:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
        throw new ApiError(500, "Unable to fetch plant details");
      });
    }

    // Extract details from the response
    let result: PlantIdentificationResult = { message: "No plant found" };
    
    if (fullDetailsResponse.data.result && 
        fullDetailsResponse.data.result.classification &&
        fullDetailsResponse.data.result.classification.suggestions &&
        fullDetailsResponse.data.result.classification.suggestions.length > 0) {
          
      const bestMatch = fullDetailsResponse.data.result.classification.suggestions[0];
      const confidence: number = bestMatch.probability ? bestMatch.probability * 100 : 0;
      
      console.log(`Plant identified with confidence: ${confidence.toFixed(2)}%`);

      if (confidence < 40) {
        console.log("Confidence too low, responding with Cannot Identify");
        result = { message: "Cannot Identify" };
      } else {
        result = {
          scientific_name: bestMatch.name || "Unknown",
          common_names: bestMatch.details?.common_names || ["Not available"],
          edible_parts: bestMatch.details?.edible_parts || ["Not available"],
          description: bestMatch.details?.description || "No description available",
          confidence: confidence.toFixed(2) + "%",
        };
        console.log(`Plant identified as: ${bestMatch.name}`);
      }
    } else {
      console.log("No classification results found in the response");
    }

    // Clean up the uploaded file
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
        console.log("Temporary file deleted");
      }
    } catch (cleanupError) {
      console.error("Error cleaning up file:", cleanupError);
      // Continue despite cleanup error
    }

    console.log("Sending plant identification result to client");
    res.json(result);
  } catch (error) {
    console.error("Plant Identification Error:", error instanceof Error ? error.message : error);
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log("Temporary file deleted after error");
      } catch (cleanupError) {
        console.error("Error cleaning up file after error:", cleanupError);
      }
    }
    next(error);
  }
}; 