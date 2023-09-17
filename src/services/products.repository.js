import ProductDTO from '../dao/DTO/products.dto.js'

export default class ProductsRepository{
    constructor(dao){
        this.dao = dao
    }
    
    async getProducts(){
        return await this.dao.getProducts()
    }
    async getProductById(id){
        const product = await this.dao.getProductById(id)
        if(!product) throw new Error('Product not finded')
        return product
        // return await this.dao.getProductById(id)
    }
    async updateProduct(id){
        return await this.dao.updateProduct(id)
    }
    async deleteProduct(id){
        return await this.dao.deleteProduct(id)
    }
    async createProduct(product){
        const productToInsert = new ProductDTO(product)

        return await this.dao.createProduct(productToInsert)
    }

}