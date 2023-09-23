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
        const updateProduct = new ProductDTO(product)
        if(updateProduct.stock === 0){
            updateProduct.status = false
        }else{
            updateProduct.status = true
        }
        return await this.dao.updateProduct(id, updateProduct)
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