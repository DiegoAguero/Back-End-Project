import fs from 'fs'
import FileManager from './FileManager.js'
export default class CartManager extends FileManager{
    constructor(path = './db/carts.db.js') {
        super(path)
    }
    //Terminar esto y products
    async getAllCarts(){
        return await this.get()
    }
    async getCartById(id){
        return await this.getById(id)
    }
    async addProductToCart(cartId, prodId){
        
    }

}