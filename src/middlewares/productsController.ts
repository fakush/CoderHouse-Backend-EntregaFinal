import { Request, Response, NextFunction } from 'express';
import { productsAPI } from '../apis/productsAPI';
import { ProductQuery, productsJoiSchema } from '../models/products/products.interface';

class Product {
  async checkValidProduct(req: Request, res: Response, next: NextFunction) {
    const validation = await productsJoiSchema.validate(req.body);
    if (validation.error) {
      return res.status(400).json({
        msg: validation.error.details[0].message
      });
    }
    next();
  }

  async checkValidId(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        msg: 'missing parameters'
      });
    }
    const producto = await productsAPI.getProducts(id);
    if (producto.length < 1) {
      return res.status(401).json({
        msg: 'Invalid Id'
      });
    }
    next();
  }

  async getProducts(req: Request, res: Response) {
    const id = req.params.id;
    const { name, description, category, price, stock, stockMin, stockMax, priceMin, priceMax } = req.query;
    if (id) {
      const producto = await productsAPI.getProducts(id);
      if (!producto) res.status(404).json({ msg: `product not found` });
      return res.json({ data: producto });
    }

    const query: ProductQuery = {};
    if (name) query.name = name.toString();
    if (description) query.description = description.toString();
    if (category) query.category = category.toString();
    if (price) query.price = Number(price);
    if (priceMin) query.priceMin = Number(priceMin);
    if (priceMax) query.priceMax = Number(priceMax);
    if (stock) query.stock = Number(stock);
    if (stockMin) query.stockMin = Number(stockMin);
    if (stockMax) query.stockMax = Number(stockMax);
    if (Object.keys(query).length) {
      return res.json({ data: await productsAPI.query(query) });
    }

    return res.json({ data: await productsAPI.getProducts() });
  }

  async addProducts(req: Request, res: Response) {
    const newItem = await productsAPI.addProduct(req.body);
    return res.json({ msg: 'creando productos', data: newItem });
  }

  async updateProducts(req: Request, res: Response) {
    const id = req.params.id;
    const updatedItem = await productsAPI.updateProduct(id, req.body);
    res.json({
      msg: 'actualizando productos',
      data: updatedItem
    });
  }

  async deleteProducts(req: Request, res: Response) {
    const id = req.params.id;
    await productsAPI.deleteProduct(id);
    return res.status(200).json({
      msg: 'borrando productos',
      data: await productsAPI.getProducts()
    });
  }
}

export const productsController = new Product();
