import TicketDTO from '../dao/DTO/tickets.dto.js'
import customId from 'r2-custom-id'
export default class TicketRepository{
    constructor(dao){
        this.dao = dao
    }
    async createTicket(amount, purchaser){
        const code = customId({
            randomLength: 4
        })
        //poner params
        const dateTime = new Date()
        
        // const ticket = {
        //     code: code,
        //     purchaser: purchaser,
        //     amount: parseInt(amount),
        //     purchase_datetime: dateTime
        // }
        const ticketToinsert = new TicketDTO({code, dateTime, amount, purchaser})
        console.log(ticketToinsert)
        return await this.dao.createTicket(ticketToinsert)

    }
    async getTicketByCode(code){
        return await this.dao.getTicketByCode(code)
    }
}