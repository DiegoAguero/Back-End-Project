import ProductDTO from '../dao/DTO/products.dto.js'

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
        updatedProduct.id = id
        return await this.dao.updateProduct(updatedProduct)
    }
    async deleteProduct(id){
        return await this.dao.deleteProduct(id)
    }

    // {
    //     "title": "Sour Cream Pringles",
    //     "description": "Sour Cream Pringles 500gr",
    //     "price": 5,
    //     "thumbnail": "/static/images/pringlessourcream.png",
    //     "code": "98cvs",
    //     "stock": 5,
    //     "status": true
    // }
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