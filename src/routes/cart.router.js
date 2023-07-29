import {Router} from 'express'
import cartModel from '../dao/models/cart.model.js'
import prodModel from '../dao/models/products.model.js'
const router = Router()

router.get('/:cId', async (req, res)=>{
    const id = req.params.cId
    const cart = await cartModel.findOne({_id: id})
    res.send({cart, status: 'success'})
})
router.post ('/', async (req, res)=>{
    const newCart = {
        product: []
    }
    const createCart = await cartModel.create(newCart)
    res.send({createCart, status: 'success'})
})

router.post('/:cId/product/:pId', async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const carritoEncontrado = await cartModel.findById(cartId)
        const productoEncontrado = await prodModel.findById(prodId)


        if(productoEncontrado === undefined){
            return res.send('No existe el producto')
        }else{  

            const isRepeated = carritoEncontrado.products.find(prod =>{
                return prod.product._id.toString() === prodId
            })
            if(isRepeated){
                isRepeated.quantity++
                await carritoEncontrado.save()
                res.send(carritoEncontrado)
            }else{
                carritoEncontrado.products.push({product: prodId})
                await carritoEncontrado.save()
                res.send(carritoEncontrado)
            }
        }

    }catch(error){
        throw new Error(error)
    }

})
export default router