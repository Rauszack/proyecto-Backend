import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
title: { type: String, unique: false },
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


productSchema.plugin(mongoosePaginate);

const Product = mongoose.model("Product", productSchema);

export default Product;