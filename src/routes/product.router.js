import {Router} from "express"
import prod from '../app.js'
import prodModel from "../dao/mongo/models/products.model.js"
import { createProduct, deleteProduct, getProductByID, getProducts, updateProduct } from "../controllers/products.controller.js"


const router = Router()
//Obtener todos los productos

router.get('/', getProducts)
router.post('/', createProduct)
router.get('/:pId', getProductByID)
router.get('/delete/:pId', deleteProduct)

//postman
router.put('/:pId', updateProduct)
router.delete('/delete/:pId', deleteProduct)

router.get('/', async (req, res)=>{
    try {
        const products = await prod.getProducts();
        return res.send(products)
    } catch (error) {
        res.send({status: 'error'})
        throw new Error(error);
    }
    
})
//Obtener producto especifico
router.get('/:pId', async (req, res)=>{
    try{
        const id = req.params.pId
        // const product = await prodModel.findOne({_id: id})
        const product = await prod.getProductById(id)
        console.log(product)
        return res.send(product)
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})
//Crear producto
router.post('/', async (req, res)=>{
    try{
        const {title, description, price, thumbnail, code, stock, status} = req.body
        const prodCreated = await prod.addProduct(title, description, price, thumbnail, code, stock, status)
        
        res.send({product: prodCreated, status: 'success'})
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})
//Actualizar producto
router.put('/:pId', async (req, res)=>{
    try{
        const id = req.params.pId
        const {title, description, price, thumbnail, code, stock, status} = req.body
        const product = await prod.updateProduct({_id: id}, {title, description, price, thumbnail, code, stock, status})
        res.send({status: 'success', product})
        
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})

//Borrar producto via form
router.get('/delete/:pId', async (req, res)=>{
    try{
        const id = req.params.pId
        const deleteProduct = await prod.deleteProductById(id)
        res.redirect('/products')
    }catch(e){
        console.error(e)
    }
})

//Borrar producto via postman
router.delete('/delete/:pId', async(req, res)=>{
    try{
        const id = req.params.pId
        const deleteProduct = await prod.deleteProductById(id)
        res.send({status: 'success', payLoad: "product deleted"})
        
    }catch(e){
        return console.error(e)
    }
})

export default router