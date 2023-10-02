import ProductDTO from '../DTO/products.dto.js'
export default class ProductManager{

    constructor(){
        this.products = []
    }
    async getProducts(){
        return this.products
    }
    async addProductToDatabase(product){
        product._id = this.products.length + 1
        const prod = this.products.push(product)
        console.log(this.products)
        return prod
    }

    async getProductById(id){
        try {
            return await this.products.find(p => p._id === parseInt(id))
            // return product    
        } catch (error) {
            throw new Error('Product not finded')
        }
    }

    async updateProduct(id, data){
        try {
            const product = await this.getProductById(id)
            product = data
            return product
        } catch (error) {
            throw new Error('The product wasnt updated')
        }
    }

}