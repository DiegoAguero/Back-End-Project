import mongoose from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    //Dudas de como hacer esto autogenerable y que no sea propio de mongo
    code: String,
    purchase_datetime: String,
    amount: Number,
    purchaser: String
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel