import TicketDTO from '../dao/DTO/tickets.dto.js'
import {ObjectId} from 'mongoose'

export default class TicketRepository{
    constructor(dao){
        this.dao = dao
    }
    async createTicket(amount, purchaser){
        const code = new ObjectId().toString()
//cambiar esto!!
        //poner params
        const dateTime = new Date()
        
        const ticket = {
            code: code,
            purchaser: purchaser,
            amount: parseInt(amount),
            purchase_datetime: dateTime
        }
        const ticketToinsert = new TicketDTO(ticket)
        console.log(ticketToinsert)
        return await this.dao.createTicket(ticketToinsert)

    }
    async getTicketByCode(code){
        return await this.dao.getTicketByCode(code)
    }
}