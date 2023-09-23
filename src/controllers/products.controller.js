import ProductManager from "../dao/mongo/ProductManager.js";
// import ProductsServices from '../services/products.repository.js'
import {productService} from '../services/index.js'
//El controller solamente debe pasar datos a la capa de negocio, osea al repository, luego ahí se hacen todas las preguntas

export const getProducts = async(req, res)=>{
    try {
        const products = await productService.getProducts();
        return res.send(products)
    } catch (error) {
        res.send({status: 'error'})
        throw new Error(error);
    }
}

export const getProductByID = async(req, res) =>{
    try{
        const id = req.params.pId
        // const product = await prodModel.findOne({_id: id})
        const product = await productService.getProductById(id)
        console.log(product)
        return res.send(product)
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
}

export const updateProduct = async (req, res)=>{
    try{
        const id = req.params.pId
        const {title, description, price, thumbnail, code, stock, status} = req.body
        const newProduct = {title, description, price, thumbnail, code, stock, status}
        const product = await productService.updateProduct({_id: id}, newProduct)
        return res.send({status: 'success', product})
        
    }catch(error){
        throw new Error(error)
    }
}

export const deleteProduct = async (req, res)=>{
    try{
        const id = req.params.pId
        const deleteProduct = await productService.deleteProduct(id)
        if(!deleteProduct) return res.send({status: 'error', payload: 'There has been a problem deleting the product'})
        return res.send({status: 'success', payload: `product deleted, ${deleteProduct}}`})
        
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
        const {title, description, price, thumbnail, code, stock, status} = req.body
        const product = {title, description, price, thumbnail, code, stock, status}
        const prodCreated = await productService.addProductToDatabase(product)
        return res.send({status: 'success', product: prodCreated})
    }catch(error){
        return res.send({status: 'error'})
    }
}