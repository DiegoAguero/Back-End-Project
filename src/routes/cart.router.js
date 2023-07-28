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
router.post ('/', async (req, res)=>{
    const newCart = {
        product: []
    }
    const createCart = await cartModel.create(newCart)
    // console.log(createCart)
    // cart.push(newCart)
    res.send({createCart, status: 'success'})
})

router.post('/:cId/product/:pId', async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const carritoEncontrado = await cartModel.findOne({_id: cartId})
        const productoEncontrado = await cartModel.findOne({_id: prodId})
        carritoEncontrado.products.push(productoEncontrado)
        // const encontrado = cart.find((cart)=> cart.id === cartId)
        // const totalProd = prod.getProducts()
        console.log(carritoEncontrado.products)

        if(productoEncontrado != undefined){
            return res.send('No existe el producto')
        }else{  
            const isRepeated = carritoEncontrado.products.find(prod=> console.log(prod))
            isRepeated? 
            isRepeated.quantity++ 
            : 
            carritoEncontrado.products.push({product: prodId, quantity: 1})
            res.send({carritoEncontrado})
        }

    }catch(error){
        throw new Error(error)
    }

})
export default router