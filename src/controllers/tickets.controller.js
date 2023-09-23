import {ticketService} from '../services/index.js'

export const createTicket = async (req, res)=>{
    const ticket = req.body
    const ticketCreated = await ticketService.createTicket(ticket)
    if(!ticketCreated) return res.send({status: 'error', payload: 'Unexpected error while creating a ticket'})
    return res.send({status: 'success', payload: ticketCreated})

}
export const getTicketByCode = async (req, res)=>{
    const code = req.params.code
    const findTicket = await ticketService.getTicketByCode(code)
    if(!findTicket)return res.send({status: 'error', payload: 'Unexpected error while finding a ticket'})
    return res.send({status: 'success', payload: findTicket})
}