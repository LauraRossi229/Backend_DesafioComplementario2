import express from 'express';
import { cartModel } from "../models/carts.models.js";
import mongoose from 'mongoose';


const cartRoute = express.Router(); // Cambiado a cartRoute

// GET api/carts/:cid - Obtener productos en un carrito
cartRoute.get('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartModel.findById(cid).populate('products.id_prod');
      
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
      
      res.json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  


// DELETE api/carts/:cid/products/:pid - Eliminar producto del carrito
cartRoute.delete('/:cid/products/:pid', async (req, res) => { // Cambiado a cartRoute
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { id_prod: pid } } },
      { new: true }
    ).populate('products.id_prod');
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT api/carts/:cid - Actualizar carrito con arreglo de productos
cartRoute.put('/:cid', async (req, res) => { 
  try {
    const { cid } = req.params;
    const { products } = req.body;
    const cart = await cartModel.findOneAndUpdate(
      { _id: cid },
      { products },
      { new: true }
    ).populate('products.id_prod');
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT api/carts/:cid/products/:pid - Actualizar cantidad de un producto en el carrito
cartRoute.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
  
      // Buscar el carrito por su ID y verificar si el producto existe en el carrito
      const cart = await cartModel.findOne({ _id: cid, 'products.id_prod': pid });
  
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado o producto no encontrado en el carrito' });
      }
  
      // Actualizar la cantidad del producto en el carrito
      cart.products.forEach((product) => {
        if (String(product.id_prod) === pid) {
          product.quantity = quantity;
        }
      });
  
      // Guardar el carrito actualizado
      const updatedCart = await cart.save();
  
      res.json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
cartRoute.delete('/:cid', async (req, res) => { // Cambiado a cartRoute
  try {
    const { cid } = req.params;
    const cart = await cartModel.findOneAndDelete({ _id: cid });
    
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    
    res.json({ message: 'Carrito eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


  
export default cartRoute; 
