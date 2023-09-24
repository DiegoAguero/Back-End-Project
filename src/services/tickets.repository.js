import TicketDTO from '../dao/DTO/tickets.dto.js'

export default class TicketRepository{
    constructor(dao){
        this.dao = dao
    }
    async createTicket(amount, purchaser){
        // const code = customId({
        //     randomLength: 4
        // })
        // console.log(code)
        // //poner params
        // const dateTime = new Date()
        
        // const ticket = {
        //     code: code,
        //     purchaser: purchaser,
        //     amount: parseInt(amount),
        //     purchase_datetime: dateTime
        // }
        console.log('Entrando en  repository')
        const ticketToinsert = new TicketDTO({amount, purchaser})
        return await this.dao.createTicket(ticketToinsert.amount, ticketToinsert.purchaser)

    }
    async getTicketByCode(code){
        return await this.dao.getTicketByCode(code)
    }
}