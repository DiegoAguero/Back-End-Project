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
        
        const newProd = new prodModel(product)
        await newProd.save()

        if (title === undefined || description === undefined || price === null || stock === undefined || code === undefined || !title || !description || !price || !stock || !code) {
            return "Error, hay un campo incompleto. Se borrará el producto. Vuelva a introducir los datos nuevamente"
        } else {
            const totalProducts = this.getProducts()
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
        // const contenido = fs.readFileSync(this.#path, 'utf-8')
        // contenidoObj = JSON.parsproducts
        return products
    }
    getProductById(id) {
        this.getProducts()
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
        this.getProducts()
        const prodDeleted = await prodModel.deleteOne({_id: id})

    }
    async updateProduct(id, title, description, price, thumbnail, code, stock, status){
        this.getProducts()
        const prodUpdated = prodModel.findOneAndUpdate({_id: id}, title, description, price, thumbnail, code, stock, status)
        // const encontrar = contenidoObj.find((prod)=> prod.id === id)
        // encontrar.title = title
        // encontrar.description = description
        // encontrar.price = price
        // encontrar.thumbnail = thumbnail
        // encontrar.code = code
        // encontrar.stock = stock
        // encontrar.status = status
    }
}

// const prod = new ProductManager('products.json')
// prod.addProduct('Botella de plastico', 'Hola soy una botella de plastico que tiene agua', 20, 'url', '123', 30)
// prod.addProduct('Lolapalooza', 'Hola 12', 30, 'url', '123', 60)
// prod.addProduct('Matias Spaciusk', '', 30, 'rs', 'ss', 30)
    