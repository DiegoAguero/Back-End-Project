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
            if(!cart)return cart
            return cart
        }catch(e){
            return console.error(e)
        }
    }

    async deleteCart(id){
        try {
            const deletedCart = await cartModel.deleteOne({_id: id})
            if(!deletedCart) throw new Error('Error: cart does not exist')
            
        } catch (error) {
            return console.error(error)
        }
    }

    async updateCart(cId, products, quantity){
        try {
            // const cart = await cartModel.findById(cId)
            return await cartModel.updateOne({_id: cId, products: products, quantity: quantity})
            // return updatedCart

        } catch (error) {
            return console.error(error)
        }
    }
    async addProductToCart(cId, pId){        
        try {
            const cart = await cartModel.findById(cId).populate('products.product').lean().exec()
            const product = await prodModel.findById(pId)
            cart.products.push({product: product, quantity: 1})
            await cart.save()
            return cart
        } catch (error) {
            return console.error(error)
        }
    }

}