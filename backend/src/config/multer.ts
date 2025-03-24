import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { Multer } from 'multer';

// Add type for multer request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Create a more robust function to ensure uploads directory exists
const ensureUploadsDirectory = () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  console.log(`Ensuring uploads directory exists at: ${uploadsDir}`);
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      console.log('Uploads directory does not exist, creating it...');
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Uploads directory created successfully');
    } else {
      console.log('Uploads directory already exists');
      
      // Check if the directory is writable
      try {
        const testFile = path.join(uploadsDir, '.write-test');
        fs.writeFileSync(testFile, 'test');
        fs.unlinkSync(testFile);
        console.log('Uploads directory is writable');
      } catch (error) {
        console.error('Uploads directory is not writable:', error);
      }
    }
    
    return uploadsDir;
  } catch (error) {
    console.error('Error creating uploads directory:', error);
    // Try to create in a system temp directory as fallback
    const tempDir = path.join(require('os').tmpdir(), 'trail-guard-uploads');
    console.log(`Attempting to create uploads directory in temp location: ${tempDir}`);
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    return tempDir;
  }
};

// Ensure uploads directory exists
const uploadsDir = ensureUploadsDirectory();

// Configure storage
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadsDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log(`Generating filename for uploaded file: ${filename}`);
    cb(null, filename);
  }
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  console.log(`Checking file type: ${file.mimetype}`);
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.error(`Rejected file with mimetype: ${file.mimetype}`);
    cb(new Error('Only image files are allowed!'));
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
}); 