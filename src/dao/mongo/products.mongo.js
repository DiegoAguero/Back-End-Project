import prodModel from "./models/products.model.js";
export default class ProductManager{

    async getProductById(id){
        return await prodModel.findById(id)
    }


}
