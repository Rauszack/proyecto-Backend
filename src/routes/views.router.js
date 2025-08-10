import express from "express";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";

const viewsRouter = express.Router();

// Página principal (home)
viewsRouter.get("/", (req, res) => {
  res.render("home");
});

// Página de productos con paginación
viewsRouter.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    let filter = {};
    if (query) {
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

    res.render("products", {
      products: result.docs,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      limit,
      sort,
      query
    });
  } catch (error) {
    res.status(500).send("Error al cargar productos: " + error.message);
  }
});

// Página de detalle de un producto
viewsRouter.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("productDetail", { product });
  } catch (error) {
    res.status(500).send("Error al obtener producto");
  }
});

// Página de un carrito específico
viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid)
      .populate("products.product")
      .lean();

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    res.render("cart", { cart });
  } catch (error) {
    res.status(500).send("Error al obtener carrito");
  }
});

export default viewsRouter;
