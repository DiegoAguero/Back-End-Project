import TicketDTO from '../DTO/tickets.dto.js'
import customId from 'r2-custom-id'
export default class TicketRepository{
    constructor(dao){
        this.dao = dao
    }
    async createTicket(amount, purchaser){
        const code = customId({
            randomLength: 4
        })
        const dateTime = new Date()
        const ticketToinsert = new TicketDTO({code, dateTime, amount, purchaser})
        return await this.dao.createTicket(ticketToinsert)

    }
    async getTicketByCode(code){
        return await this.dao.getTicketByCode(code)
    }
}