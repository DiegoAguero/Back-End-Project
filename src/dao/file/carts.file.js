import fs from 'fs'
import FileManager from './FileManager.js'
import CartDTO from '../DTO/carts.dto.js'
import ProductManager from './products.file.js'
const productManager = new ProductManager()
export default class CartManager extends FileManager{
    constructor(path = './db/carts.db.js') {
        super(path)
    }
    //Terminar esto y products
    async createCart(array = []){
        const cartToInsert = new CartDTO(array)
        console.log(cartToInsert)
        return await this.add(cartToInsert)
    }

    async getAllCarts(){
        return await this.get()
    }
    async getCartById(id){
        return await this.getById(id)
    }
    async addProductToCart(cartId, prodId){
        const prod = await productManager.getProductById(prodId)
        const cart = await this.getById(cartId)
        let quantity = 1
        if(cart && prod){
            cart.products.push({product: prod, quantity: quantity})
            console.log(cart)
            return await this.update(cart)
        }
    }

    async updateCart(cart){
        console.log(cart.id)
        return await this.update(cart)
    }

}