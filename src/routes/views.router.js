import express from 'express';
import ProductManager from '../ProductManager.js';

const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

  const user = { username: "Rauszack", isAdmin: false };

const middlewareIsAdmin = (req, res, next) => {
  if (user.isAdmin) {
    next();
  } else {
    res.redirect("/error");
  }
};

// Endpoints
viewsRouter.get("/", middlewareIsAdmin, (req, res) => {
  res.render("home");
});

viewsRouter.get("/dashboard", async(req, res) => {
  const products = await productManager.getProducts();
  res.render("dashboard", { products, user });
});


viewsRouter.use(express.json());


//GET - Obtener datos
viewsRouter.get("/", (req, res)=> {

  res.json({ status: "success", message: "Hola mundo" });
});

viewsRouter.get("/api/products", async(req, res)=> {
  try {
    const products = await productManager.getProducts();

    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//POST
viewsRouter.post("/api/products", async(req, res) => {
  try {
    const newProduct = req.body;
    const products = await productManager.addProduct(newProduct);
    res.status(201).json({ status : "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//DELETE
viewsRouter.delete("/api/products/:pid", async(req, res)=> {
  try {
    const productId = req.params.pid;
    const products = await productManager.deleteProductById(productId);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//PUT
viewsRouter.put("/api/products/:pid", async(req, res)=> {
  try {
    const productId = req.params.pid;
    const updatedData = req.body;

    const products = await productManager.updateProductById(productId, updatedData);
    res.status(200).json({ status: "success", products });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

//getProductBy
viewsRouter.get("/api/products/:pid", async(req, res)=> {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
});

export default viewsRouter;