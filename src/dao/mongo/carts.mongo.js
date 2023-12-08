import CustomError from "../../services/errors/customErrors.js";
import cartModel from "./models/cart.model.js";
import ProductManager from "./products.mongo.js";
import EErrors from "../../services/errors/enums.js";
import { logger } from "../../services/logger/logger.js";
export default class CartManager{
    constructor(){
        this.productManager = new ProductManager()
    }
    async createCart(array){
        try {
            return await cartModel.create(array)
        } catch (e) {
            return CustomError.createError({
                name: "Create cart error",
                cause: e,
                message: "Error trying to create the cart",
                code: EErrors.DATABASES_ERROR
            })
        }
    }

    async getAllCarts(populate = false){
        try{
            if(populate){
                const getCarts = await cartModel.find().populate('products.product').lean().exec()
                return getCarts
            }
            const getCarts = await cartModel.find().lean().exec()
            return getCarts
        }catch(e){
            CustomError.createError({
                name: "Get all carts error",
                cause: e,
                message: "Error trying to get all the carts",
                code: EErrors.DATABASES_ERROR
            })
        }
    }

    async getCartById(populate = false, id){
        try{
            if(populate){
                return await cartModel.findById(id).populate('products.product').lean().exec()
            }
            return await cartModel.findById(id)
        }catch(e){
            CustomError.createError({   
                name: "Get cart error",
                cause: e,
                message: "Error trying to get the cart",
                code: EErrors.DATABASES_ERROR
            })
        }
    }
    async deleteCart(id){
        try {
            return await cartModel.deleteOne({_id: id})
        } catch (error) {
            CustomError.createError({
                name: "Delete cart error",
                cause: error,
                message: "Error trying to delete the cart",
                code: EErrors.DATABASES_ERROR
            })
        }
    }

    async updateCart(cId, products){
        try {
            console.log(products)
            const cart = await cartModel.findByIdAndUpdate({_id: cId}, {$set: {products: products}}, {new: true})
            console.log(cart)
            return cart
        } catch (error) {
            CustomError.createError({
                name: "Update cart error",
                cause: error,
                message: "Error trying to update the cart",
                code: EErrors.DATABASES_ERROR
            })
        }
    }
    async addProductToCart(cId, pId){        
        try {
            const cart = await this.getCartById(false, cId)
            const product = await this.productManager.getProductById(pId)
            cart.products.push({product: product._id, quantity: 1})
            await cart.save()
            return cart
        } catch (error) {
            CustomError.createError({
                name: "Add product to cart error",
                cause: error,
                message: "Error trying to add the product to the cart",
                code: EErrors.DATABASES_ERROR
            })
        }
    }

}