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

    async addProductToDatabase(title, description, price, thumbnail, code, stock, status=true){

        try{
            const product = await prodModel.create({title, description, price, thumbnail, code, stock, status})
            const {_id} = product
            console.log(_id)
            product._id = _id
            // await this.getProducts()
            return product
        }catch(e){
            return console.error(e) 
        }

            
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
    async addProduct(title, description, price, thumbnail, code, stock, status=true) {
        if(title === undefined || description === undefined || price === NaN || stock === NaN || code === undefined || !title || !description || !price || !stock || !code){
            return "Error, hay un campo incompleto. Se borrará el producto. Vuelva a introducir los datos nuevamente"
        }else{
            try{
                return await this.addProductToDatabase(title, description, price, thumbnail, code, stock, status)
            }catch(e){
                return console.error(e)
            }
        }

    }

    async getProducts() {
        const products = await prodModel.find().lean().exec()
        return products
    }

    async updateTotalProducts(){
        const totalProducts = await this.getProducts()
    }

    async getProductById(id) {
        await this.updateTotalProducts()
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
        await this.updateTotalProducts()
        const prodDeleted = await prodModel.deleteOne({_id: id})

    }
    async updateProduct(id, title, description, price, thumbnail, code, stock, status){
        await this.updateTotalProducts()
        const prodUpdated = await prodModel.findOneAndUpdate({_id: id}, title, description, price, thumbnail, code, stock, status)

    }
}

// const prod = new ProductManager('products.json')
// prod.addProduct('Botella de plastico', 'Hola soy una botella de plastico que tiene agua', 20, 'url', '123', 30)
// prod.addProduct('Lolapalooza', 'Hola 12', 30, 'url', '123', 60)
// prod.addProduct('Matias Spaciusk', '', 30, 'rs', 'ss', 30)
    