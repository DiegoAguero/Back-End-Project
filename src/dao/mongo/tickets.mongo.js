import CustomError from "../../services/errors/customErrors.js";
import EErrors from "../../services/errors/enums.js";
import ticketModel from "./models/ticket.model.js";
import {logger} from  '../../services/logger/logger.js'
export default class TicketManager{
    
    async createTicket(ticket){
        try {
            const ticketCreated = await ticketModel.create(ticket)
            console.log(ticket)
            return ticketCreated
            
        } catch (error) {
            CustomError.createError({
                name: "Create ticket error",
                cause: error,
                message: "Error trying to create the ticket",
                code: EErrors.DATABASES_ERROR
            })
        }
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