import express, { Router, Request, Response } from 'express';
import image_upload from '../controllers/user-image.controller';
import multer from 'multer';
import validate_api_key from '../middlewares/api-key-validation.middleware';

const image_router: Router = express.Router();
const upload = multer({ dest: 'uploads/' });

image_router.patch('/image', validate_api_key, upload.single('image'), (req: Request, res: Response) => {
    image_upload.upload(req, res);
});

export default image_router;
