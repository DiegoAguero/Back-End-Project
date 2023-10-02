import CartDTO from '../dao/DTO/carts.dto.js'
import ProductDTO from '../dao/DTO/products.dto.js'
import {cartService, productService, ticketService} from '../services/index.js'



export default class CartRepository{
    //DAO es la variable que recibimos desde el factory
    constructor(dao){
        this.dao = dao

    }

    async createCart(array){
        const cartToInsert = new CartDTO(array)
        return await this.dao.createCart(cartToInsert)
    }
    async getAllCarts(populate = false){
        return await this.dao.getAllCarts(populate)
    }
    async getCartById(populate = false, id){
        return await this.dao.getCartById(populate, id)
    }
    async updateCart(cId, products){
        return await this.dao.updateCart(cId, products)
    }
    async clearCart(id){
        const cart = await this.dao.getCartById(id)
        cart.products = []
        await this.dao.updateCart(id, cart.products)
        // await cart.save()
        return cart
    }
    async addProductToCart(cId, pId){
        const cart = await this.dao.getCartById(cId)
        const getProduct = await productService.getProductById(pId)
        // por alguna razon no me dejaba compararlos como tal sin ponerle toString, simplemente decia que esa condicion era false todo el tiempo
        const isRepeated = cart.products?.find(prod =>{
            if(prod.product?._id){
                console.log(prod.product?._id.toString() === getProduct._id.toString())
                return prod.product?._id.toString() === getProduct._id.toString()
            }else{
                return prod?.product === getProduct._id
            }
        })
        // console.log(isRepeated)
        if(!isRepeated){
            console.log('entre aca')
            return await this.dao.addProductToCart(cId, pId)

        }else{
            isRepeated.quantity++
            // console.log(isRepeated.quantity++)
            // console.log(isRepeated)
            // console.log(cart)
            //Solucionar error de que no se actualiza en la primera iteracion, se actualiza en la segunda
            return await this.dao.updateCart(cart._id, isRepeated)
            // console.log(isRepeated.quantity++)
            // console.log(cart.products.push())            
            // isRepeated.quantity++
            // return await this.dao.updateCart(isRepeated)
            // await cart.save()
        }
    }

    async deleteProductFromCart(cId, pId){
        const cart = await this.dao.getCartById(cId)
        const product = await productService.getProductById(pId)
        const isInCart = cart.products.find(prod =>{
            if(prod.product._id){
                return prod.product._id === product._id
            }else{
                console.log(prod.product === product._id)
                return prod.product === product._id
            }
        })
        
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity -= 1
                return await this.dao.updateCart(cart._id, cart)
                // return await cart.save()
                
                // res.send(carritoEncontrado)
                // res.send({findedCart})
                // res.render('carts', {findedCart})
                // res.redirect(`/cart/${cartId}`)
            }else{
                const cartFilter = cart.products.filter(prod=>{return prod.product != isInCart.product})
                cart.products = cartFilter
                // return await cart.save()
                return await this.dao.updateCart(cart._id, cart)
                
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
        let cartPopulated = await this.dao.getCartById(true, cId)
        console.log(cartPopulated)
        let totalPrice = 0
        let productsNotProcessed = []
        cartPopulated.products.forEach(async prod => {
            if(prod.product.stock < prod.quantity){
                let quantityProductsNotPurchased = prod.quantity - prod.product.stock
                productsNotProcessed.push({product: prod.product._id, quantity: quantityProductsNotPurchased})
                if(prod.product.stock !== 0){
                    console.log('Supuestamente no tengo 0 stock, ' + prod.product.stock)
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
        console.log(resultCart)
        const ticket = await ticketService.createTicket(totalPrice, email)
        console.log(ticket)
        //Solucionar error de que ticketService no retorna el ticket
        return ticket
    }
    
} 