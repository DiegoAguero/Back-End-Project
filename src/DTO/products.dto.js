export default class ProductManager {
    constructor(prod){
        this.title = prod?.title ?? ''
        this.description = prod?.description ?? ''
        this.price = parseFloat(prod?.price) ?? 0
        this.thumbnail = prod?.thumbnail ?? ''
        this.code = prod?.code ?? ''
        this.owner = prod?.owner ?? 'admin'
        this.stock = parseInt(prod?.stock) ?? 0
        this.status = prod?.status ?? true
    }
}