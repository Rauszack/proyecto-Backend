import express from "express";
import Cart from "../models/cart.model.js";

const cartRouter = express.Router();

// Crear carrito vacío
cartRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart({ products: [] });
    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Obtener TODOS los carritos (nueva ruta)
cartRouter.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product");
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Obtener carrito por ID con populate
cartRouter.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Agregar producto al carrito
cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    res.status(201).json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE - eliminar un producto específico del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT - actualizar todos los productos del carrito
cartRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ status: "error", message: "El body debe contener un arreglo de productos" });
    }

    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT - actualizar cantidad de un producto específico
cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ status: "error", message: "Cantidad inválida" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE - vaciar carrito
cartRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default cartRouter;
