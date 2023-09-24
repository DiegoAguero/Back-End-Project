import cartModel from "./models/cart.model.js";
import prodModel from './models/products.model.js'
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

    async getCarts(){
        try{
            const getCarts = await cartModel.find().populate('products.product').lean().exec()
            return getCarts
        }catch(e){
            return console.error(e)
        }
    }

    async getCartById(id){
        try{
            const cart = await cartModel.findById(id).populate('products.product').lean().exec()
            if(!cart) throw new Error('The cart does not exist')
            return cart
        }catch(e){
            return console.error(e)
        }
    }
    // async getCartByIdPopulated(id){
    //     try{
    //         const cart = await cartModel.findById(id).populate('products.product').lean().exec()
    //         console.log(cart)
    //         if(!cart) throw new Error('The cart does not exist')
    //         return cart
    //     }catch(e){
    //         return console.error(e)
    //     }
    // }
    async deleteCart(id){
        try {
            const deletedCart = await cartModel.deleteOne({_id: id})
            if(!deletedCart) throw new Error('Error: cart does not exist')
            return deletedCart
            
        } catch (error) {
            return console.error(error)
        }
    }

    async updateCart(cId, products){
        try {
            // const cart = await this.getCartById(cId)
            // console.log(JSON.stringify(cartPopulated, null,'\t'))
            // console.log('Cart', JSON.stringify(cart, null,'\t'))
            return await cartModel.findByIdAndUpdate({_id: cId}, {$set: {products: products}})
        } catch (error) {
            return console.error(error)
        }
    }
    async addProductToCart(cId, pId){        
        try {
            const cart = await this.getCartById(cId)
            const product = await prodModel.findById(pId)
            cart.products.push({product: product._id})
            await cart.save()
            return cart

        } catch (error) {
            return console.error(error)
        }
    }

}