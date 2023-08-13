import cartModel from "./models/cart.model.js";
import prodModel from "./models/products.model.js";
export default class CartManager{
    async createCart(){
        try {
            const createCart = {
                product: []
            }
            const cart = await cartModel.create(createCart)
            return cart
        } catch (e) {
            return console.error(e)
        }
    }
    async getCartById(cartId){
        try{
            const cart = await cartModel.findById(cartId)
                .populate('products.product').exec()
            if(cart === undefined){
                console.log("Not found")
                return cart
            }else{
                return cart
            }
        }catch(e){
            return console.error(e)
        }
    }
    async getTotalCarts(){
        try{
            const totalCarts = await cartModel.find()
            return totalCarts
        }catch(e){
            return console.error(e)
        }
    }
    async addProductToCart(cartId, prodId){
        try{
            const cart = await cartModel.findById(cartId)
            const product = await prodModel.findById(prodId)
            cart.products.push({_id: product})
            return cart
        }catch(e){
            return console.error(e)
        }
    }
    // async deleteProductsFromCart(cartId){
    //     try{
    //         const products = []
    //         const cart = await cartModel.findOne({_id: cartId})
    //         if(cart.products.length === 0){
    //             return res.send({status: 'error', payLoad: `No existen productos en el carrito`})
    //         }
    //         cart.products = products
    //         return cart
    //     }catch(e){
    //         return console.error(e)
    //     }

    // }
    async deleteCartById(cartId){
        await this.updateTotalCarts()
        const cartDeleted = await cartModel.deleteOne({_id: cartId})
    }
    async updateTotalCarts(){
        try{
            const updateCarts = await this.getTotalCarts()
        }catch(e){
            return console.error(e)
        }
    }
    async updateCartWithArray(cartId, products, quantity){
        try{
            await this.updateTotalCarts()
            // const product = await prodModel.findById(prodId)
                // if(product){
                const cart = await cartModel.findOneAndUpdate({_id: cartId}, {product: products, quantity: quantity} )
                return cart
                // }else{
                // console.log("Not found")
                // }

            // cart.updateOne()
        }catch(e){
            return console.error(e)
        }
    }
    
}