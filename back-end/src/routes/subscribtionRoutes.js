import express from 'express';
import { subscribe } from '../controllers/subscribtionController.js';

const router = express.Router();

// Fix by explicitly asserting the request handler type
router.post('/subscribe', subscribe );


export default router;
