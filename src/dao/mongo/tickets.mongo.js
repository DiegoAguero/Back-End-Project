import ticketModel from "./models/ticket.model.js";
export default class TicketManager{
    
    async createTicket(amount, purchaser){
        //poner params
        // console.log(code)
        // const ticket = {
        //     code: 
        // }
        const ticketCreated = ticketModel.create(ticket)
        if(!ticketCreated) throw new Error('Error trying to create a ticket!')
        return ticketCreated
    }
    async getTicketByCode(code){
        const ticket = await ticketModel.findOne({code: code})
        if(!ticket) throw new Error('Error trying to find a ticket!')
        return ticket
        
    }
}