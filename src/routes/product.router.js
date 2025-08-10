import express from "express";
import Product from "../models/product.model.js";

const productsRouter = express.Router();

// GET con paginación, filtros y orden
productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
      // Si el query es categoría o disponibilidad (true/false)
      const isAvailable = query.toLowerCase() === "true" || query.toLowerCase() === "false";
      if (isAvailable) {
        filter.status = query.toLowerCase() === "true";
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };

    if (sort) {
      options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await Product.paginate(filter, options);

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/api/products?limit=${limit}&page=${result.prevPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
        : null,
      nextLink: result.hasNextPage
        ? `/api/products?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}`
        : null
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET producto por ID
productsRouter.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// POST crear producto
productsRouter.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// PUT actualizar producto
productsRouter.put("/:pid", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// DELETE eliminar producto
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", payload: deletedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default productsRouter;
