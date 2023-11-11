import ProductManager from "../dao/mongo/ProductManager.js";
// import ProductsServices from '../services/products.repository.js'
import {productService} from '../services/index.js'
//El controller solamente debe pasar datos a la capa de negocio, osea al repository, luego ahí se hacen todas las preguntas

export const getProducts = async(req, res)=>{
    try {
        const products = await productService.getProducts();
        return res.send({status: 'success', payload: products})
    } catch (error) {
        return res.send({status: 'error', payload: error})
    }
}

export const getProductByID = async(req, res) =>{
    try{
        const id = req.params.pId
        // const product = await prodModel.findOne({_id: id})
        const product = await productService.getProductById(id)
        req.logger.info(product)
        return res.send({status: 'success', payload: product})
    }catch(error){
        return res.send({status: 'error', payload: error})

    }
}

export const updateProduct = async (req, res)=>{
    try{
        const id = req.params.pId
        const {title, description, price, thumbnail, code, stock, status} = req.body
        const newProduct = {title, description, price, thumbnail, code, stock, status}
        req.logger.info(id)
        const product = await productService.updateProduct(id, newProduct)
        return res.send({status: 'success', payload: product})
        
    }catch(error){
        throw new Error(error)
    }
}

export const deleteProduct = async (req, res)=>{
    try{
        const id = req.params.pId
        const deleteProduct = await productService.deleteProduct(id)
        console.log('Deleted product: ', deleteProduct)
        if(!deleteProduct) return res.send({status: 'error', payload: 'There has been a problem deleting the product'})
        return res.send({status: 'success', payload: deleteProduct})
        
    }catch(e){
        return console.error(e)
    }
}
export const updateStock = async (req, res)=>{
    try {
        const pId = req.params.pId
        const stock = parseInt(req.body.stock)
        const updatedStock = await productService.updateStock(pId, stock)
        if(!updatedStock) return res.send({status: 'error', payload: 'There has been a problem updating the stock!'})
        return res.send({status: 'success', payload: 'Stock updated!'})
    } catch (error) {
        throw new error(error)
    }
}



export const addProductToDatabase = async (req, res)=>{
    try{
        let owner;
        const {title, description, price, thumbnail, code, stock, status} = req.body
        
        req.user.rol === 'premium' ? owner = req.user.email : ''
        
        const product = {title, description, price, thumbnail, code, owner, stock, status}
        const prodCreated = await productService.addProductToDatabase(product)
        return res.send({status: 'success', payload: prodCreated})
    }catch(error){
        req.logger.info("Error: " + error)
        return res.send({status: 'error', payload: error})
    }
}