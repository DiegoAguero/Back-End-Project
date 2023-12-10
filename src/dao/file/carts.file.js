import fs from 'fs'
import FileManager from './FileManager.js'
import CartDTO from '../../DTO/carts.dto.js'
import ProductManager from './products.file.js'
export default class CartManager extends FileManager{
    constructor(path = './db/carts.db.js') {
        super(path)
        this.productManager = new ProductManager()
    }
    async createCart(array = []){
        const cartToInsert = new CartDTO(array)
        return await this.add(cartToInsert)
    }

    async getAllCarts(populate = false){
        const carts = await this.get()
        if(populate){
            const products = await this.productManager.getProducts()
            for (let i = 0; i < carts.length; i++) {
                const result = []
                const cartProducts = carts[i].products
                cartProducts.forEach((prodId)=>{
                    let prod = products.find(prod => parseInt(prod._id) == parseInt(prodId.product))
                    result.push(prod)
                })
                carts[i].products = result
                
            }
        }
        return carts
    }
    async getCartById(populate = false, id){
        const cart = await this.getById(id)
        if(populate){
            const products = await this.productManager.getProducts()
            if(cart?.products){
                cart.products.forEach(product=>{
                    let prod = products.find(prod=>  parseInt(prod._id) == parseInt(product.product))
                    //De esta forma modifico el producto y no el array entero
                    product.product = prod
                })
            }
        }
        return cart
    }
    async addProductToCart(cartId, prodId){
        const prod = await this.productManager.getProductById(prodId)
        const cart = await this.getById(cartId)
        let quantity = 1
        if(cart && prod){
            cart.products.push({product: prod._id, quantity: quantity})
            return await this.update(cartId, cart)
        }else{
            throw new Error('Something is missing!')
        }
    }

    async updateCart(id, cart){
        return await this.update(id, cart)
    }

}