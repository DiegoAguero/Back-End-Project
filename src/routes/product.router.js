import {Router} from "express"
// import prod from '../app.js'
import prodModel from "../dao/models/products.model.js"


const router = Router()

router.get('/', async (req, res)=>{
    try {
        const products = await prodModel.find().lean().exec()
        
        // const products = await prod.getProducts();
        const limit = req.query.limit;
        if (limit === undefined) return res.send(products);
        return res.send(products.slice(0, limit));
    } catch (error) {
        res.send({status: 'error'})
        throw new Error(error);
    }
    
})

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

router.post('/:pId', async (req, res)=>{
    try{
        const id = req.params.pId
        const product = await prodModel.findOneAndUpdate({_id: id}, req.body)
        // const newProd = req.body
        // const {title, description, price, thumbnail, code, stock, status} = newProd
        // prod.updateProduct(id, title, description, price, thumbnail, code, stock, status)
        res.send({status: 'success'})
        
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})

export default router