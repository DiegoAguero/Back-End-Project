import CartDTO from '../dao/DTO/carts.dto.js'
import ProductDTO from '../dao/DTO/products.dto.js'
import productsServices from './products.repository.js'
const productDAO = new ProductsRepository()

export default class CartRepository{
    constructor(dao){
        this.dao = dao
    }

    async createCart(){
        return await this.dao.createCart()
    }

    async getCartById(id){
        return await this.dao.getCartById(id)
    }

    async addProductToCart(cId, pId){
        const cart = this.getCartById(cId)
        const cartToComprobe = new CartDTO(cart) 

        //const getProduct = productManager.getProductById(pId)
        //const productToComprobe = new ProductDTO(getProduct)
        //return await this.dao.addProductToCart(cartToComprobe, productToComprobe)

        return await this.dao.addProductToCart(cartToComprobe, pId)
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

    async updateCartWithArray(cId){
        return await this.dao.updateCartWithArray(cId)
    }
    
}