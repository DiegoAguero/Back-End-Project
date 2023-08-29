import mongoose from 'mongoose'

const userCollection = 'users'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    rol: {
        type: String,
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart"
    }
    
})
const userModel = mongoose.model(userCollection, userSchema)

export default userModel