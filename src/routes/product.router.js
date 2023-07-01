import {Router} from "express"
import prod from '../app.js'

const router = Router()

router.get('/', (req, res)=>{
    try {
        const products = prod.getProducts();
        const limit = req.query.limit;
        if (limit === undefined) return res.send(products);
        return res.send(products.slice(0, limit));
    } catch (error) {
        res.send({status: 'error'})
        throw new Error(error);
    }
    
})
router.get('/:pId', (req, res)=>{
    try{
    const id = req.params.pId
    const encontrado = prod.getProductById(id)
    if(encontrado === undefined) return res.send('Producto no encontrado')
    return res.send(encontrado)
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})
router.post('/', (req, res)=>{
    try{
        const newProd = req.body
        const {title, description, price, thumbnail, code, stock, status} = newProd
        prod.addProduct(title, description, price, thumbnail, code, stock, status)
        res.send({status: 'success'})
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})
router.post('/:pId', (req, res)=>{
    try{
        const id = parseInt(req.params.pId)
        const newProd = req.body
        const {title, description, price, thumbnail, code, stock, status} = newProd
        prod.updateProduct(id, title, description, price, thumbnail, code, stock, status)
        res.send({status: 'success'})
        
    }catch(error){
        res.send({status: 'error'})
        throw new Error(error)
    }
})
export default router