import prodModel from './models/products.model.js';
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
            await this.updateTotalProducts()
            return product
        }catch(e){
            return console.error(e) 
        }

    }
    async addProduct(title, description, price, thumbnail, code, stock, status=true) {
        if(title === undefined || description === undefined || price === NaN || stock === NaN|| code === undefined || !title || !description || !price || !code){
            return "Error, hay un campo incompleto. Se borrará el producto. Vuelva a introducir los datos nuevamente"
        }else{
            try{
                if(parseInt(stock) === 0){
                    status = false
                    return await this.addProductToDatabase(title, description, price, thumbnail, code, stock, status)

                }else{
                    console.log("estoy")
                    return await this.addProductToDatabase(title, description, price, thumbnail, code, stock, status)
                }
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
            return findProduct
        } else {
            return findProduct
        }
    }
    async deleteProductById(id) {
        await this.updateTotalProducts()
        const prodDeleted = await prodModel.deleteOne({_id: id})
    }
    async updateProduct(id, title, description, price, thumbnail, code, stock, status){
        await this.updateTotalProducts()
        const prodUpdated = await prodModel.updateOne({_id: id}, title, description, price, thumbnail, code, stock, status)

    }
}
