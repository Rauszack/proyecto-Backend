import express from 'express';
import Product from "../models/product.model.js";
import ProductManager from '../ProductManager.js';
import uploader from '../utils/uploader.js';


const productsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

productsRouter.get("/", async (req, res) => {
    try {
       const products = await Product.find();
       res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", message: "error al recuperar los productos" });
    }
});

productsRouter.post("/", uploader.single("file"), async (req, res) => {
//comprobamos que nos envien el archivo
    if (!req.file) return res.status(401).json({ status: "error", message: "Falta adjuntar la imagen al formulario" });

    const title = req.body.title;
    const price = parseInt(req.body.price);
    const thumbnail = "/img/" + req.file.filename; 

    await productManager.addProduct({ title, price, thumbnail});
    res.redirect("/dashboard");
});

productsRouter.post("/", async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        const product = new Product({ title, description, code, price, stock, category  });
        await product.save();
        res.status(201).json({ status: "success", payload: product, message: "producto creado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "error al añadir un nuevo producto" });      
    }
});

productsRouter.put("/:pid", async (req, res) => {
    try {
    const pid = req.params.pid;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(pid, updatedData, { new: true, runValidators: true });
    if (!updatedProduct) {
        return res.status(404).json({ status: "error", message: "producto no encontrado" });
    }
    res.status(200).json({ status: "success", payload: updatedProduct, message: "producto actualizado" });
    } catch (error) {
    res.status(500).json({ status: "error", message: "error al editar un producto" });     
}
});

productsRouter.delete("/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const deletedProduct = await Product.findByIdAndDelete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ status: "error", message: "producto no encontrado" });
        }
        res.status(200).json({ status: "success", payload: deletedProduct, message: "producto eliminado" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "error al borrar un producto" });     
}
    }
);

export default productsRouter;