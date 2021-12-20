import { Request, Response, NextFunction } from 'express';
import { productsAPI } from '../apis/productsAPI';

class ImageController {

    async getImages(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: 'missing parameters' });
          const producto = await productsAPI.getProducts(id);
          if (!producto) res.status(404).json({ msg: `product not found` });
          return res.status(200).json(producto[0].images);
        }

    
    async uploadImage(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if (!id) return res.status(400).json({ msg: 'missing parameters' });
        const producto = await productsAPI.getProducts(id);
        if (!producto) res.status(404).json({ msg: `product not found` });
        const newImageArray = [...producto[0].images, req.body.image];
        const updatedItem = await productsAPI.updateProduct(id, {images: newImageArray});
        res.json({
          msg: 'añadiendo imagen',
          data: updatedItem.images
        });
        next();
    }
}

export const imageController = new ImageController();