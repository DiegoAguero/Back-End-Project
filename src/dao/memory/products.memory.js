import ProductDTO from '../DTO/products.dto.js'
export default class ProductManager{

    constructor(){
        this.products = []
    }
    async getProducts(){
        return this.products
    }
    async addProductToDatabase(product){
        const productToInsert = new ProductDTO(product)
        productToInsert._id = this.products.length + 1
        const prod = this.products.push(productToInsert)
        return prod
    }

    async getProductById(id){
        try {
            const product = this.products.find(p => p._id === id)
            return product    
        } catch (error) {
            throw new Error('Product not finded')
        }
    }

    async updateProduct(id, data){
        try {
            const product = this.getProductById(id)
            product = data
            return product
        } catch (error) {
            throw new Error('The product wasnt updated')
        }
    }

}