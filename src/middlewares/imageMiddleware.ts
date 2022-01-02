import cloudinary from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import Config from '../config';
import { Logger } from '../utils/logger';

class ImageMiddleware {
    constructor() {
        cloudinary.v2.config({
            cloud_name: Config.CLOUDINARY_CLOUD_NAME,
            api_key: Config.CLOUDINARY_API_KEY,
            api_secret: Config.CLOUDINARY_API_SECRET
        });
    }

    async uploadImage(req: Request, res: Response, next: NextFunction) {
        const data = {image: req.file.path};
        Logger.debug(`Uploading image ${data.image}`);
        if (!data.image) return res.status(400).json({ msg: 'missing image' });
        await cloudinary.v2.uploader.upload(data.image, (err: any, result: any) => {
            if (err) return res.status(400).json({ msg: 'error uploading image', err });
            req.body.image = result.secure_url;
            req.body.cloudinary_result = result;
            next();
        });
    }

    async deleteImage(req: Request, res: Response, next: NextFunction) {
        Logger.debug(`Deleting image ${req.body.image}`);
        const data = {image: req.body.image};
        if (!data.image) return res.status(400).json({ msg: 'missing image name' });
        await cloudinary.v2.uploader.destroy(data.image, (err: any, result: any) => {
            if (err) return res.status(400).json({ msg: 'error deleting image' });
        });
        next();
    }
}

export const imageMiddleware = new ImageMiddleware();