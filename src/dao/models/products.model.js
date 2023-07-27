import mongoose from "mongoose";

const prodCollection = 'products'

const prodSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code:{
        type: String,
        unique: true    
    },
    stock: Number,
    status: {
        type: Boolean,
        default: true
    }
})

const prodModel = mongoose.model(prodCollection, prodSchema)

export default prodModel