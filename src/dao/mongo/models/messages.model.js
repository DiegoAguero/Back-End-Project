import mongoose from "mongoose";

const msgCollection = 'messages'

const msgSchema = new mongoose.Schema({
    user: String,
    message: String
})

const msgModel = mongoose.model(msgCollection, msgSchema)

export default msgModel