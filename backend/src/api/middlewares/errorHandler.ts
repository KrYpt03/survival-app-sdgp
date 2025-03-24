import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Custom error class for API errors
export class ApiError extends Error {
  statusCode: number;
  errors?: any;
  
  constructor(statusCode: number, message: string, errors?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err);
  
  // Log request details in development mode
  if (process.env.NODE_ENV === 'development') {
    console.error('Request body:', req.body);
    console.error('Request query:', req.query);
    console.error('Request params:', req.params);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: err.errors,
      error: 'The data provided is not valid.'
    });
  }

  // Handle Prisma database errors
  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'A record with this data already exists',
        error: `Duplicate field: ${err.meta?.target}`,
      });
    }
    
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        error: err.message,
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Database error',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
  }

  // Handle Multer / image upload errors
  if (err.name === 'MulterError') {
    const errorMessage = getMulterErrorMessage(err);
    return res.status(400).json({
      success: false,
      message: 'Image upload failed',
      error: errorMessage,
    });
  }

  // Handle file system errors (common in image processing)
  if (err.name === 'Error' && err.message.includes('ENOENT')) {
    return res.status(500).json({
      success: false,
      message: 'File processing error',
      error: 'Could not read or write the image file. Please try again.',
    });
  }

  // Handle axios errors (common for third-party API calls)
  if (err.name === 'AxiosError') {
    return res.status(502).json({
      success: false,
      message: 'External service error',
      error: 'The plant identification service is temporarily unavailable. Please try again later.',
    });
  }

  // Handle custom API errors
  if (err instanceof ApiError) {
    // Special handling for plant identification errors
    if (req.path.includes('/plant/identify') && err.statusCode === 500) {
      return res.status(err.statusCode).json({
        success: false,
        message: 'Image analysis failed',
        error: 'We could not process your plant image. Please try with a clearer photo or different lighting.',
      });
    }

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Handle all other errors
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Provide more user-friendly error messages for plant identification
  if (req.path.includes('/plant/identify')) {
    return res.status(statusCode).json({
      success: false,
      message: 'Failed to analyze image',
      error: 'We encountered an issue while processing your plant image. Please try again with a clearer photo.',
    });
  }

  // Default error response
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.stack,
  });
};

// Helper function to get user-friendly Multer error messages
function getMulterErrorMessage(err: any): string {
  switch (err.code) {
    case 'LIMIT_FILE_SIZE':
      return 'The image file is too large. Please upload an image smaller than 5MB.';
    case 'LIMIT_UNEXPECTED_FILE':
      return 'Wrong field name was used for the image upload.';
    case 'LIMIT_FILE_COUNT':
      return 'Too many files uploaded. Please upload only one image.';
    default:
      return err.message || 'Error uploading image.';
  }
} 