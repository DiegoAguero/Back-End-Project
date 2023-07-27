import {Router} from 'express'
// import prod from '../app.js'
import cartModel from '../dao/models/cart.model.js'
const router = Router()
const cart = []

let id = 0

router.get('/:cId', (req, res)=>{
    const id = req.params.cId
    const cart = cartModel.findOne({_id: id})
    res.send({encontrado, status: 'success'})
})
router.post('/', (req, res)=>{
    const newCart = {
        id: id+=1,
        product: []
    }
    cart.push(newCart)
    res.send({cart, status: 'success'})
})

router.post('/:cId/product/:pId', (req, res)=>{
    try{
        const cartId = parseInt(req.params.cId)
        const prodId = parseInt(req.params.pId)
        const encontrado = cart.find((cart)=> cart.id === cartId)
        const totalProd = prod.getProducts()
        if(totalProd.length < prodId){
            return res.send('No existe el producto')
        }else{  
            const isRepeated = encontrado.product.find((prod)=> prod.product === prodId)
            isRepeated? 
            isRepeated.quantity++ 
            : 
            encontrado.product.push({product: prodId, quantity: 1})

            res.send({encontrado})
        }

    }catch(error){
        throw new Error(error)
    }

})
export default router