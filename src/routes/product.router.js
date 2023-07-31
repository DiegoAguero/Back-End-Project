import {Router} from "express"
// import prod from '../app.js'
import prodModel from "../dao/models/products.model.js"


const router = Router()
//Obtener todos los productos
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
        const product = await prodModel.findOne({_id: id})
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
        const newProd = req.body
        const prodCreated = new prodModel(newProd)
        await prodCreated.save()
        
        res.send({product: prodCreated, status: 'success'})
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})
//Actualizar producto

router.post('/:pId', async (req, res)=>{
    try{
        const id = req.params.pId
        const product = await prodModel.findOneAndUpdate({_id: id}, req.body)
        res.send({status: 'success'})
        
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})
//Borrar producto
router.get('/delete/:pId', async (req, res)=>{
    try{
        const id = req.params.pId
        await prodModel.deleteOne({_id: id})
        res.redirect('/realtimeproducts')
    }catch(e){
        console.error(e)
    }
})

export default router