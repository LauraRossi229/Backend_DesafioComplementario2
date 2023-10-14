import { Router } from "express";
import { productModel } from "../models/products.models.js";
import { passportError, authorization } from "../utils/messagesError.js";


const productRouter = Router();


// GET para obtener productos con paginación, límite, ordenamiento y búsqueda
productRouter.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const options = {};

  if (sort === 'asc' || sort === 'desc') {
    options.sort = { price: sort };
  }

  const filter = query ? { category: query } : {};

  try {
    const products = await productModel.paginate(filter, {
      limit: parseInt(limit),
      page: parseInt(page),
      ...options,
    });

    res.json({
      status: 'success',
      payload: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevPage ? `/api/products?page=${products.prevPage}` : null,
      nextLink: products.nextPage ? `/api/products?page=${products.nextPage}` : null,
    });
     } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta para obtener productos y renderizar la vista HTML
productRouter.get('/products', async (req, res) => {
  
    const { first_name, last_name, email } = req.query;
    const { limit = 10, page = 1, sort, query } = req.query;
    const options = {};
  
    if (sort === 'asc' || sort === 'desc') {
      options.sort = { price: sort };
    }
  
    const filter = query ? { category: query } : {};
  
    try {
      const products = await productModel.paginate(filter, {
        limit: parseInt(limit),
        page: parseInt(page),
        ...options,
      });
  //console.log(products);
  
  res.render('products', { userData: { first_name, last_name, email }, products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });
  
  // Ruta para ver detalles de un producto (colocarla después de la ruta de listado de productos)
  productRouter.get('/products/:productId', async (req, res) => {
    try {
      const productId = req.params.productId;
      // Obtén el producto de la base de datos utilizando el ID
      const product = await productModel.findById(productId);
      
      if (!product) {
        return res.status(404).send('Producto no encontrado');
      }
  
      // Renderiza la vista de detalles del producto
      res.render('productDetails', { product });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener detalles del producto.');
    }
  });
  

// POST para agregar un producto
productRouter.post('/', passportError('jwt'), authorization('Admin'), async (req, res) => {
  try {
    const { title, description, price, stock, category, code, thumbnails } = req.body;
    const newProduct = new productModel({
      title,
      description,
      price,
      stock,
      category,
      code,
      thumbnails
    });
    const savedProduct = await newProduct.save();
    res.status(201).json({ respuesta: 'OK', mensaje: savedProduct });
  } catch (error) {
    res.status(500).send({ respuesta: 'Error en agregar producto', mensaje: error.message });
  }
});

// PUT para actualizar un producto
productRouter.put('/:id', passportError('jwt'), authorization('Admin'), async (req, res) => {
  const { id } = req.params;
  const { title, description, stock, status, code, price, category } = req.body;

  try {
    const prod = await productModel.findByIdAndUpdate(id, { title, description, stock, status, code, price, category });
    if (prod)
      res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' });
    else
      res.status(404).send({ respuesta: 'Error en actualizar Producto', mensaje: 'Not Found' });
  } catch (error) {
    res.status(400).send({ respuesta: 'Error en actualizar producto', mensaje: error.message });
  }
});

// DELETE para eliminar un producto
productRouter.delete('/:id', passportError('jwt'), authorization('Admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productModel.findByIdAndDelete(id);
    if (prod)
      res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' });
    else
      res.status(404).send({ respuesta: 'Error en eliminar Producto', mensaje: 'Not Found' });
  } catch (error) {
    res.status(400).send({ respuesta: 'Error en eliminar producto', mensaje: error.message });
  }
});

export default productRouter;
