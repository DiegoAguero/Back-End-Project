import fs from 'fs'
import FileManager from './FileManager.js'
export default class ProductManager extends FileManager {
    constructor(path = './db/products.json'){
        super(path)
    }

    async getProducts(){
        return await this.get()
    }

    async getProductById(id){
        return await this.getById(id)
    }

    async addProductToDatabase(product){
        return await this.add(product)
    }

    async updateProduct(id, data){
        return await this.update(id, data)
    }
}

// const prod = new ProductManager('products.json')
// prod.addProduct('Botella de plastico', 'Hola soy una botella de plastico que tiene agua', 20, 'url', '123', 30)
// prod.addProduct('Lolapalooza', 'Hola 12', 30, 'url', '123', 60)
// prod.addProduct('Matias Spaciusk', '', 30, 'rs', 'ss', 30)
    