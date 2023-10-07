import CustomError from "../../services/errors/customErrors.js";
import EErrors from "../../services/errors/enums.js";
import ticketModel from "./models/ticket.model.js";

export default class TicketManager{
    
    async createTicket(ticket){
        try {
            return await ticketModel.create(ticket)
            
        } catch (error) {
            CustomError.createError({
                name: "Create ticket error",
                cause: error,
                message: "Error trying to create the ticket",
                code: EErrors.DATABASES_ERROR
            })
        }
        // const ticket = {
        //     code: code.toString(),
        //     purchaser: purchaser,
        //     amount: amount,
        //     purchaser_datetime: dayTime
        // }
        // if(!ticketCreated) throw new Error('Error trying to create a ticket!')
        // return ticketCreated
    }
    async getTicketByCode(code){
        try {
            const ticket = await ticketModel.findOne({code: code})
            return ticket
            
        } catch (error) {
            CustomError.createError({
                name: "Get ticket by code error",
                cause: error,
                message: "Error trying to get the ticket",
                code: EErrors.DATABASES_ERROR
            })   
        }

        
    }
}