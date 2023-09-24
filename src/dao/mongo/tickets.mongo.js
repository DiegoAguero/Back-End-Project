import ticketModel from "./models/ticket.model.js";
import customId from 'r2-custom-id'

export default class TicketManager{
    
    async createTicket(amount, purchaser){
        const code = customId({
            randomLength: 4
        })

        // const ticket = {
        //     code: code.toString(),
        //     purchaser: purchaser,
        //     amount: amount,
        //     purchaser_datetime: dayTime
        // }
        const dayTime = new Date().toString()
        const ticketCreated = await ticketModel.create({code: code.toString(), purchaser: purchaser, amount: amount, purchaser_datetime: dayTime})
        if(!ticketCreated) throw new Error('Error trying to create a ticket!')
        return ticketCreated
    }
    async getTicketByCode(code){
        const ticket = await ticketModel.findOne({code: code})
        if(!ticket) throw new Error('Error trying to find a ticket!')
        return ticket
        
    }
}