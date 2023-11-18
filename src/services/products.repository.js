import ProductDTO from '../DTO/products.dto.js'

export default class ProductsRepository{
    constructor(dao){
        this.dao = dao
    }
    
    async getProducts(){
        return await this.dao.getProducts()
    }
    async getProductById(id){
        return await this.dao.getProductById(id)
    }
    async updateProduct(id, product){
        const updatedProduct = new ProductDTO(product)
        if(updatedProduct.stock === 0){
            updatedProduct.status = false
        }else{
            updatedProduct.status = true
        }

        updatedProduct._id = id
        return await this.dao.updateProduct(updatedProduct._id, updatedProduct)
    }
    async deleteProduct(id){
        return await this.dao.deleteProduct(id)
    }
    async addProductToDatabase(product){
        const productToInsert = new ProductDTO(product)
        if(parseInt(productToInsert.stock) === 0) {
            productToInsert.status = false
            return await this.dao.addProductToDatabase(productToInsert)
        }
        return await this.dao.addProductToDatabase(productToInsert)
    }
    async updateStock(id, stock){
        
        return await this.dao.updateStock(id, stock)

    }
}