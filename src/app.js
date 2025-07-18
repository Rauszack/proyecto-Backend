import express from "express";
import { engine } from "express-handlebars"; 
import cartRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/product.router.js"; 
import connectMongooseDb from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT; 

connectMongooseDb();

app.use(express.static("src/public"));
app.use(express.urlencoded({ extended: true }));

// handlebars configuration
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);


app.listen(PORT, ()=> {
  console.log(`Servidor iniciado en el puerto: ${PORT}`);
});