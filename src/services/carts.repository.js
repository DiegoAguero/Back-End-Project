import CartDTO from '../dao/DTO/carts.dto.js'
import {cartService, productService, ticketService} from '../services/index.js'
import CustomError from './errors/customErrors.js'
import EErrors from './errors/enums.js'
import {logger} from '../services/logger/logger.js'


export default class CartRepository{
    //DAO es la variable que recibimos desde el factory
    constructor(dao){
        this.dao = dao

    }

    async createCart(array){
        try {
            const cartToInsert = new CartDTO(array)
            return await this.dao.createCart(cartToInsert)
        } catch (error) {
            CustomError.createError({
                name: "Cart creation error",
                cause: error,
                message: "Error trying to create the cart",
                code: EErrors.DATABASES_ERROR
            })
        }

    }
    async getAllCarts(populate = false){
        try {
            return await this.dao.getAllCarts(populate)
        } catch (error) {
            CustomError.createError({
                name: "Get all carts error",
                cause: error,
                message: "Error trying to get the carts",
                code: EErrors.DATABASES_ERROR
            })
        }
    }
    async getCartById(populate = false, id){
        const cart = await this.dao.getCartById(populate, id)
        logger.info(cart)
        return cart
        // return await this.dao.getCartById(populate, id)
    }
    async updateCart(cId, products){
        return await this.dao.updateCart(cId, products)
    }
    async clearCart(id){
        const cart = await this.dao.getCartById(false, id)
        return await this.dao.updateCart(cart._id, [])
    }
    async addProductToCart(cId, pId){
        const cart = await this.dao.getCartById(true, cId)
        const getProduct = await productService.getProductById(pId)
        const isRepeated = cart.products?.find(prod =>{
            if(prod.product?._id){
                return prod.product?._id.toString() === getProduct._id.toString()
            }else{
                return prod?.product === getProduct._id
            }
        })
        if(!isRepeated){
            return await this.dao.addProductToCart(cId, pId)

        }else{
            isRepeated.quantity++
            return await this.dao.updateCart(cart._id, cart.products)

        }
    }

    async deleteProductFromCart(cId, pId){
        const cart = await this.dao.getCartById(true, cId)
        const product = await productService.getProductById(pId)
        const isInCart = cart.products.find(prod =>{
            if(prod.product._id){
                return prod.product._id.toString() === product._id.toString()
            }else{
                return prod.product === product._id
            }
        })
        
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity -= 1
                return await this.dao.updateCart(cart._id, cart.products)

            }else{
                const cartFilter = cart.products.filter(prod=>{return prod.product != isInCart.product})
                cart.products = cartFilter
                return await this.dao.updateCart(cart._id, cart.products)

            }
        }
    }
    async deleteCart(cId){
        return await this.dao.deleteCart(cId)
    }

    async updateQuantityFromCart(cId, pId){
        return await this.dao.updateQuantityFromCart(cId, pId)
    }

    async purchaseProducts(cId, email){
        let cartPopulated = await this.dao.getCartById(true, cId)
        let totalPrice = 0
        let productsNotProcessed = []
        cartPopulated.products.forEach(async prod => {
            if(prod.product.stock < prod.quantity){
                let quantityProductsNotPurchased = prod.quantity - prod.product.stock
                productsNotProcessed.push({product: prod.product._id, quantity: quantityProductsNotPurchased})
                if(prod.product.stock !== 0){
                    totalPrice += prod.product.price * prod.product.stock
                }
                //Esto es para dejarlo exactamente a 0 y no negativo, ya sabemos que hay menos stock que cantidad
                prod.product.stock -= prod.product.stock
                await productService.updateProduct(prod.product._id, prod.product)

            }else{
                prod.product.stock -= prod.quantity
                totalPrice += prod.product.price * prod.quantity 
                await productService.updateProduct(prod.product._id, prod.product)

            }
        });

        const resultCart = await cartService.updateCart(cId, productsNotProcessed)
        // console.log(resultCart)
        const ticket = await ticketService.createTicket(totalPrice, email)
        return ticket

        // console.log(ticket)
        //Solucionar error de que ticketService no retorna el ticket
        // return ticket
    }
    
} 