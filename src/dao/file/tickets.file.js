import TicketDTO from '../../DTO/tickets.dto.js'
import FileManager from './FileManager.js';

export default class TicketManager extends FileManager{
    constructor(path = './db/tickets.db.js'){
        super(path)
    }
    async createTicket(ticket){
        const ticketToInsert = new TicketDTO(ticket)
        return await this.add(ticketToInsert)
    }

    async getTicketById(id){
        return await this.getById(id)
    }
    
}