import CartDTO from '../dao/DTO/carts.dto.js'
import ProductDTO from '../dao/DTO/products.dto.js'
import {productService, ticketService} from '../services/index.js'
import config from '../config/config.js'
// import ProductsServices from './products.repository.js'



export default class CartRepository{
    //DAO es la variable que recibimos desde el factory
    constructor(dao){
        this.dao = dao
    }

    async createCart(array){
        const cartToInsert = new CartDTO(array)
        console.log(cartToInsert)
        return await this.dao.createCart(cartToInsert)
    }
    async getCarts(){
        return await this.dao.getCarts()
    }
    async getCartById(id){
        return await this.dao.getCartById(id)
        // return await this.dao.getCartById(id)
    }
    async getCartByIdPopulated(id){
        const cart = await this.dao.getCartById(id)
        return cart
    }
    async updateCart(cId, products){
        return await this.dao.updateCart(cId, products)
    }
    async addProductToCart(cId, pId){
        const cart = await this.dao.getCartById(cId)
        const getProduct = await productService.getProductById(pId)
        //por alguna razon no me dejaba compararlos como tal sin ponerle toString, simplemente decia que esa condicion era false todo el tiempo
        const isRepeated = cart.products.find(prod =>{
            return prod.product?._id === getProduct._id
        })
        // console.log(isRepeated)
        if(!isRepeated){
            // console.log('Entro aca siempre')
            return await this.dao.addProductToCart(cId, pId)

        }else{
            isRepeated.quantity++
            // console.log(isRepeated.quantity++)
            // console.log(isRepeated)
            // console.log(cart)
            return await this.dao.updateCart(cart)
            // console.log(isRepeated.quantity++)
           // console.log(cart.products.push())            // isRepeated.quantity++
            // return await this.dao.updateCart(isRepeated)
            // await cart.save()
        }
    }

    async deleteProductFromCart(cId, pId){
        const cart = await this.getCartById(cId)
        const prod = await productService.getProductById(pId)
        const isInCart = cart.products.find(prod =>{
            return prod.product._id.toString() === pId
        })
        
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity -= 1
                return await cart.save()
                
                // res.send(carritoEncontrado)
                // res.send({findedCart})
                // res.render('carts', {findedCart})
                // res.redirect(`/cart/${cartId}`)
            }else{
                const cartFilter = cart.products.filter(prod=>{return prod.product != isInCart.product})
                cart.products = cartFilter
                return await cart.save()
                
                // res.send(carritoEncontrado)
                // res.render('carts', {findedCart})
                // res.redirect(`/cart/${cartId}`)
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
        const cartPopulated = await this.dao.getCartById(cId)
        // const cart = await this.dao.getCartById(cId)
        let totalPrice = 0
        let productsNotProcessed = []
        // console.log("cart populated", cartPopulated)
        cartPopulated.products.forEach(prod => {
            if(prod.product.stock < prod.quantity){
                let quantityProductsNotPurchased = prod.quantity - prod.product.stock
                productsNotProcessed.push({product: prod.product._id, quantity: quantityProductsNotPurchased})

                totalPrice += prod.product.price * prod.product.stock
            }else{
                prod.product.stock -= prod.quantity
                // const totalStock = prod.product.stock - prod.quantity
                totalPrice += prod.product.price * prod.quantity 
            }
        });
        // console.log("Cart populated", cartPopulated)
        // console.log(cart, cartPopulated)
        //La mejor forma de guardar un carrito con populate
        //Es haciendo $set, mirar documentacion 
        //Arreglar esto
        console.log('Precio total: ', totalPrice)
        console.log("Cantidad de productos que no fueron procesados: ", productsNotProcessed)
        console.log(JSON.stringify(cartPopulated, null,'\t'))
        const result = await this.dao.updateCart(cId, cartPopulated.products)
        console.log("Result of update: ", JSON.stringify(result, null,'\t'))
        // const purchasedAt = new Date()
        // console.log(purchasedAt.toString())
        
        // return await ticketService.createTicket(totalPrice, email)
        // const ticketCreated = ticketModel.create({amount: totalPrice, purchasedAt.toString()})
    }
    
} 