import CartDTO from '../DTO/carts.dto.js'
import {cartService, productService, ticketService, userService} from '../services/index.js'
import CustomError from './errors/customErrors.js'
import EErrors from './errors/enums.js'
import {logger} from '../services/logger/logger.js'
import PaymentService from './payment.repository.js'
import Mail from './nodemailer/mail.js'

export default class CartRepository{
    //DAO es la variable que recibimos desde el factory
    constructor(dao){
        this.dao = dao
        this.mail = new Mail()
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
        return cart
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

    async purchaseProducts(cId, purchaser){
        const paymentService = new PaymentService()
        const user = await userService.getUserByEmail(purchaser)
        let cartPopulated = await this.dao.getCartById(true, cId)
        let totalPrice = 0
        let productsNotProcessed = []
        let productsProcessed = []
        cartPopulated.products.forEach(async prod => {
            if(prod.product.stock < prod.quantity){
                let quantityProductsNotPurchased = prod.quantity - prod.product.stock
                if(quantityProductsNotPurchased >= 1 && prod.product.stock >=1){
                    prod.quantity = quantityProductsNotPurchased
                    productsNotProcessed.push(prod)
                    productsProcessed.push({name: prod.product.title, quantity: prod.product.stock, _id: prod.product._id, price: prod.product.price})
                    totalPrice += prod.product.price * prod.product.stock
                }else if(prod.product.stock == 0){
                    prod.quantity = quantityProductsNotPurchased
                    productsNotProcessed.push(prod)
                }
                //Esto es para dejarlo exactamente a 0 y no negativo, ya sabemos que hay menos stock que cantidad
                prod.product.stock -= prod.product.stock
                await productService.updateProduct(prod.product._id, prod.product)

            }else{
                prod.product.stock -= prod.quantity
                productsProcessed.push({name: prod.product.title, quantity: prod.quantity, _id: prod.product._id, price: prod.product.price})
                totalPrice += prod.product.price * prod.quantity 
                await productService.updateProduct(prod.product._id, prod.product)

            }
        });
        cartPopulated.products = productsNotProcessed
        await this.dao.updateCart(cartPopulated._id, cartPopulated.products)
        const ticket = await ticketService.createTicket(totalPrice, purchaser)
        let html;
        let content = productsProcessed?.reduce(function(a, b){
            return a + '<p>' + 'Name: ' + b.name + ' Quantity: ' + b.quantity + " Price: $" + b.price + '</p>' 
        }, '')
        let content2;
        if(productsNotProcessed.length == 0){
            html = 
            `
                Your purchase has been successfully processed! Here's your ticket and your items!
                code: ${ticket.code}
                amount: ${ticket.amount},
                date: ${ticket.purchase_datetime.getDate()}/${ticket.purchase_datetime.getMonth()}/${ticket.purchase_datetime.getFullYear()}
                Products purchased: ${content}
            `
        }else{
            content2 = productsNotProcessed?.reduce(function(a, b){
                return a + '<p>' + 'Name: ' + b.product.title + ' Quantity: ' + b.quantity + " Price: $" + b.product.price + '</p>' 
            }, '')
            html = 
            `
                Your purchase has been successfully processed! Here's your ticket and your items!
                code: ${ticket.code}
                amount: $${ticket.amount},
                date: ${ticket.purchase_datetime.getDate()}/${ticket.purchase_datetime.getMonth()}/${ticket.purchase_datetime.getFullYear()}
                Products purchased: ${content}
                Products NOT processed: ${content2}
            `
        }
        //arreglar esto, para que mande el mail cuando se procese la compra
        const pay = await paymentService.createPaymentIntent(productsProcessed)
        if(!pay){
            throw new Error('Cannot create payment intent')
        }
        await this.mail.send(user, 'Purchase ticket!', html)
        return pay
    }
    
} 