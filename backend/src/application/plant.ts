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

const KINDWISE_API_KEY: string = process.env.KINDWISE_API_KEY || '';
const KINDWISE_URL: string = "https://plant.id/api/v3/identification";

export const identifyPlant = async (
  req: Request & { file?: Express.Multer.File },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(400, "Image file is required");
    }

    const imageBase64: string = fs.readFileSync(req.file.path, { encoding: "base64" });

    const requestData = {
      images: [imageBase64],
      classification_level: "species",
      similar_images: true,
      health: "auto",
    };

    // Send request to Kindwise API
    const response = await axios.post<KindwiseResponse>(KINDWISE_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
        "Api-Key": KINDWISE_API_KEY,
      },
    });

    if (!response.data.access_token) {
      throw new ApiError(500, "No access_token received from API");
    }
    const accessToken: string = response.data.access_token;

    // Fetch Complete Details Using `access_token`
    const detailsUrl: string = `https://plant.id/api/v3/identification/${accessToken}?details=common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods&language=en`;

    const fullDetailsResponse = await axios.get<KindwiseResponse>(detailsUrl, {
      headers: { "Api-Key": KINDWISE_API_KEY },
    });

    // Extract details from the response
    let result: PlantIdentificationResult = { message: "No plant found" };
    if (fullDetailsResponse.data.result && fullDetailsResponse.data.result.classification) {
      const bestMatch = fullDetailsResponse.data.result.classification.suggestions[0];
      const confidence: number = bestMatch.probability ? bestMatch.probability * 100 : 0;

      if (confidence < 40) {
        result = { message: "Cannot Identify" };
      } else {
        result = {
          scientific_name: bestMatch.name || "Unknown",
          common_names: bestMatch.details?.common_names || ["Not available"],
          edible_parts: bestMatch.details?.edible_parts || ["Not available"],
          description: bestMatch.details?.description || "No description available",
          confidence: confidence.toFixed(2) + "%",
        };
      }
    }

    // Clean up the uploaded file
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (error) {
    console.error("Plant Identification Error:", error instanceof Error ? error.message : error);
    next(error);
  }
}; 