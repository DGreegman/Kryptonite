import { Request, Response } from 'express';
import user_image_service from '../services/user-image.service';
import fs from 'fs';

interface ImageFile extends Request {
    file?: any;
    mimetype?: string;
}
class UserImageController {
    async upload(req: ImageFile, res: Response) {
        const { user } = res.locals;
        console.log(user);
        if (!req.file) {
            return res.status(400).json({
                success: 'fail',
                message: 'No file uploaded'
            });
        }

        if (req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg') {
            const result = await user_image_service.save_image(req.file.originalname, req.file.path, user);

            return res.status(201).json({
                status: 'success',
                message: 'Image Saved Successfully...',
                result: result
            });
        }
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
            success: 'fail',
            message: `${req.file.originalname} is an Invalid file type we only allow png, jpg files`,
            path: req.file.path
        });
    }
}

export default new UserImageController();
