import mongoose from "mongoose";

const cartCollection = 'cart'

const cartSchema = new mongoose.Schema({
    products:[  
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products'
            },
            quantity: Number
        }
    ]
})

const cartModel = mongoose.model(cartCollection, cartSchema)
export default cartModel