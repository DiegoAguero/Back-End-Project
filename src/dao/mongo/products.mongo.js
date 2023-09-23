import prodModel from "./models/products.model.js";
export default class ProductManager{

    async getProducts(){
        return await prodModel.find().lean().exec()
    }
    async updateTotalProducts(){
        const totalProducts = await this.getProducts()
    }
    async getProductById(id){
        const prod = prodModel.findById(id)
        if(!prod) throw new Error('The products doesnt exist')
        return await prodModel.findById(id)
    }

    async addProductToDatabase(product){
        try{
            const productCreated = await prodModel.create(product)
            console.log(productCreated)
            await this.updateTotalProducts()
            return productCreated
        }catch(e){
            return console.error(e) 
        }
    }
    async deleteProduct(id){

        await this.updateTotalProducts()
        const prodDeleted = await prodModel.deleteOne({_id: id})
        return prodDeleted

    }

    async updateProduct(id, product){
        await this.updateTotalProducts()
        console.log(product)
        const prodUpdated = await prodModel.updateOne({_id: id}, product)
        return prodUpdated
    }

    async updateStock(id, stock){
        await this.updateTotalProducts()
        return await prodModel.updateOne({_id: id}, {$set: stock})
    }
}
