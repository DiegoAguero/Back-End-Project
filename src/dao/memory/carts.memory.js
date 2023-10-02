import ProductManager from './products.memory.js'
export default class CartManager{
    constructor(){
        this.cart = []
        this.productManager = new ProductManager()
    }
    async getAllCarts(populate = false){
        if(populate){

        }
        return this.cart
    }
    async createCart(){
        const newCart = {
            _id: this.cart.length + 1,
            products: []
        }
        this.cart.push(newCart)
        return newCart
    }

    async getCartById(id){
        try {
            console.log(id)
            const cart = this.cart.find(c =>c._id === parseInt(id))
            return cart 
        } catch (error) {
            throw new Error('Cart not finded')
        }

    }

    async addProductToCart(cartId, prodId){
        const cart = await this.getCartById(cartId)
        const product = await this.productManager.getProductById(prodId)
        console.log(product)
        cart.products.push(product)
        return cart
    }

    async updateCart(id, cart){
        let cartFinded = this.cart.find(c => c._id === id)
        console.log(cartFinded)
        cartFinded = cart
        console.log(cartFinded)
        return cartFinded

    }



}