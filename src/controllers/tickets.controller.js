import CustomError from '../services/errors/customErrors.js';
import EErrors from '../services/errors/enums.js';
import { generateTicketErrorInfo } from '../services/errors/info.js';
import {ticketService} from '../services/index.js'

export const createTicket = async (req, res)=>{

        const {amount, purchaser} = req.body
        let ticketCreated;    
        if(!amount ||!purchaser){
            CustomError.createError({
                name: "Ticket creation error",
                cause: generateTicketErrorInfo(amount, purchaser),
                message: "Error trying to create the ticket",
                code: EErrors.INVALID_TYPE_ERROR
            })
        }
        ticketCreated = await ticketService.createTicket({amount, purchaser})
        return res.send({status: 'success', payload: ticketCreated})


}
export const getTicketByCode = async (req, res)=>{
    const code = req.params.code
    const findTicket = await ticketService.getTicketByCode(code)
    
    if(!findTicket){
        CustomError.createError({
            name: "Get ticket error",
            cause: generateTicketErrorInfo(code),
            message: "Ticket not found",
            code: EErrors.NOT_FOUND_ERROR
        })
    }
    return res.send({status: 'success', payload: findTicket})
}