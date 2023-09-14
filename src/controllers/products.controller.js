import ProductManager from "../dao/mongo/ProductManager.js";
import productServices from '../services/products.repository.js'

const productServices = new ProductsRepository()

export const getProducts = async(req, res)=>{
    try {
        const products = await productServices.getProducts();
        return res.send(products)
    } catch (error) {
        res.send({status: 'error'})
        throw new Error(error);
    }
}

export const getProductByID = async(req, res) =>{
    try{
        const {id} = req.params.pId
        // const product = await prodModel.findOne({_id: id})
        const product = await productServices.getProductById(id)
        console.log(product)
        return res.send(product)
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
}

export const updateProduct = async (req, res)=>{
    try{
        const {id} = req.params.pId
        const {title, description, price, thumbnail, code, stock, status} = req.body
        const product = await productServices.updateProduct({_id: id}, {title, description, price, thumbnail, code, stock, status})
        res.send({status: 'success', product})
        
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
}

export const deleteProduct = async (req, res)=>{
    try{
        const {id} = req.params.pId
        const deleteProduct = await productServices.deleteProductById(id)
        res.send({status: 'success', payLoad: `product deleted, ${deleteProduct}}`})
        
    }catch(e){
        return console.error(e)
    }
}

export const createProduct = async (req, res)=>{
    try{
        const {title, description, price, thumbnail, code, stock, status} = req.body
        const product = {title, description, price, thumbnail, code, stock, status}
        const prodCreated = await productServices.addProduct(product)
        
        res.send({product: prodCreated, status: 'success'})
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
}