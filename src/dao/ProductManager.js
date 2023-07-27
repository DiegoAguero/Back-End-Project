// import fs from 'fs'
import prodModel from './models/products.model.js';
// let contenidoObj = ''
export default class ProductManager {
    constructor() {

    }

    // getNextID() {
    //     const id = this.products.length;
    //     const nextID = (id > 0) ? id + 1 : 1
    //     return nextID;
    // }
    async addProduct(title, description, price, thumbnail, code, stock, status) {

        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status  
        }


        if (title === undefined || description === undefined || price === null || stock === undefined || code === undefined || !title || !description || !price || !stock || !code) {
            return "Error, hay un campo incompleto. Se borrará el producto. Vuelva a introducir los datos nuevamente"
        } else {
            const newProd = await prodModel.create(product)
            const {_id} = newProd
            console.log(_id)
            newProd._id = _id
            await this.getProducts()
            return newProd
            
            // if (totalProducts.length >= 2) {
            //     for (let value in totalProducts) {
            //         let numeroIterado = parseInt(value) + 1
            //         if (totalProducts[value].code == totalProducts[numeroIterado]?.code) {
            //             console.log('Error, objeto repetido: ', totalProducts[numeroIterado])
            //             totalProducts.pop()
            //         }
            //     }
            // }
        }
    }

    async getProducts() {
        const products = await prodModel.find().lean().exec()
        return products
    }

    async getProductById(id) {
        await this.getProducts()
        const findProduct = prodModel.findOne({_id: id})
        if (findProduct === undefined) {
            console.log("Not found")
            return encontrado
        } else {
            console.log('Producto encontrado:', encontrado)
            return encontrado
        }
    }
    async deleteProductById(id) {
        await this.getProducts()
        const prodDeleted = await prodModel.deleteOne({_id: id})

    }
    async updateProduct(id, title, description, price, thumbnail, code, stock, status){
        await this.getProducts()
        const prodUpdated = await prodModel.findOneAndUpdate({_id: id}, title, description, price, thumbnail, code, stock, status)

    }
}

// const prod = new ProductManager('products.json')
// prod.addProduct('Botella de plastico', 'Hola soy una botella de plastico que tiene agua', 20, 'url', '123', 30)
// prod.addProduct('Lolapalooza', 'Hola 12', 30, 'url', '123', 60)
// prod.addProduct('Matias Spaciusk', '', 30, 'rs', 'ss', 30)
    