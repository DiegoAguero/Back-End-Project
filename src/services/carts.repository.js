import CartDTO from '../dao/DTO/carts.dto.js'
import ProductDTO from '../dao/DTO/products.dto.js'
import {productService} from '../services/index.js'

// import ProductsServices from './products.repository.js'



export default class CartRepository{
    //DAO es la variable que recibimos desde el factory
    constructor(dao){
        this.dao = dao
    }

    async createCart(){
        return await this.dao.createCart()
    }

    async getCartById(id){
        const cart = await this.dao.getCartById(id)
        return cart
        // return await this.dao.getCartById(id)
    }
    async updateCart(cId, products, quantity){
        return await this.dao.updateCart(cId, products, parseInt(quantity))
    }

    async clearCart(id){
        const cart = await this.dao.getCartById(id)
        cart.products = []
        return cart
    }

    async addProductToCart(cId, pId){
        const cart = await this.dao.getCartById(cId)
        const getProduct = await productService.getProductById(pId)
        const isRepeated = cart.products.find(prod =>{
            return prod.product?._id.toString() === getProduct._id
        })
        if(!isRepeated){
            console.log(cart, getProduct)
            return await this.dao.addProductToCart(cId, pId)
            // cart.products.push({product: getProduct._id, quantity: 1})
            // console.log(cart)
        }else{

            // await this.dao.updateCart(cId, getProduct, quantity++)
        }
        // if(cart.stock <= isRepeated.quantity) {
        //     throw new Error('No more stock')
        // }
        // else {
        //     // isRepeated? isRepeated.quantity++ : ''
        // }
        // await cart.save()
        // if(isRepeated){
        //     if(cart.stock <= isRepeated.quantity){throw new Error('No more stock')}
        //     else{
        //         isRepeated.quantity++ 
        //         // await cart.save()
        //     }
        // }else{
        //     // await cart.save()
        // }
        // await cart.save()
        // return await this.dao.addProductToCart(cId, pId)
        // return await this.dao.addProductToCart(cartToComprobe, productToComprobe)

        // return await this.dao.addProductToCart(cartToComprobe, pId)
    }

    async deleteProductFromCart(cId, pId){
        return await this.dao.deleteProductFromCart(cId, pId)
    }

    async deleteCart(cId){
        return await this.dao.deleteCart(cId)
    }

    async updateQuantityFromCart(cId, pId){
        return await this.dao.updateQuantityFromCart(cId, pId)
    }


    
} 