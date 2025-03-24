import express from 'express';
import { identifyPlant } from '../../application/plant.js';
import { upload } from '../../config/multer.js';

const router = express.Router();

// Route for plant identification
router.post('/identify', upload.single('image'), identifyPlant);

export default router; 