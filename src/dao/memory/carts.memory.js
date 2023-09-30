import ProductManager from './products.memory.js'
export default class CartManager{
    constructor(){
        // this.id = 0
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

    async getCartByID(id){
        try {
            const cart = this.cart.find(c => c.id === id)
            return cart 
        } catch (error) {
            throw new Error('Cart not finded')
        }

    }

    async addProductToCart(cartId, prodId){
        const cart = this.getCartByID(cartId)
        const product = this.productManager.getProductById(prodId)
        cart.product.push(product)
        return cart
        // const product = 
    }

    async updateCart(id, cart){
        let cartFinded = this.cart.find(c => c.id === id)
        console.log(cartFinded)
        cartFinded = cart
        console.log(cartFinded)
        return cartFinded

    }



}