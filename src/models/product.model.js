import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
title: { type: String, unique: true },
description: { type: String, index: "text" },
thumbnail: { type: String, default:"" },
Code: { type: String, unique: true },
price: { type: Number, required: true },
category: { type: String, index: true },
stock: { type: Number, required: true },
status: {type: Boolean, default: true },
    created_at: {
        type: Date, 
        default: Date.now(),
    }
    }
);


const Product = mongoose.model("Product", productSchema);

export default Product;