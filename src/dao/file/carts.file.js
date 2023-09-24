import fs from 'fs'
let contenidoObj
export default class CartManager{
    #path
    constructor(path) {
        this.#path = path
        this.carts = []
    }

    getNextID() {
        const id = this.products.length;
        const nextID = (id > 0) ? id + 1 : 1
        return nextID;
    }
    getAllCarts(){
        const contenido = fs.readFileSync(this.#path, 'utf-8')
        contenidoObj = JSON.parse(contenido)
        return contenidoObj
    }
    getCartById(id){
        
    }
    addProductToCart(cartId, prodId){
        
    }

}