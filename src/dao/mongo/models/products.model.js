import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

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
    owner:{
        type: mongoose.Schema.Types.String,
        ref: "users",
        default: "admin"
    },
    stock: Number,
    status: {
        type: Boolean,
        default: true
    }
})
prodSchema.plugin(mongoosePaginate)
const prodModel = mongoose.model(prodCollection, prodSchema)

export default prodModel