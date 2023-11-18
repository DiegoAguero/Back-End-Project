export default class TicketManager{
    constructor(ticket){
        this.code = ticket?.code ?? ''
        this.purchase_datetime = ticket?.purchase_datetime ?? new Date()
        this.amount = ticket?.amount ?? 0
        this.purchaser = ticket?.purchaser ?? ''
    }
    
}