import {Router} from 'express'
import cartModel from '../dao/models/cart.model.js'
import prodModel from '../dao/models/products.model.js'
const router = Router()
//Hacer para mañana: Populate y arreglar los filtros
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

router.delete('/:cId/product/:pId', async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const carritoEncontrado = await cartModel.findById(cartId)
        // const productoEncontrado = await prodModel.findById(prodId)
        const isInCart = carritoEncontrado.products.find(prod =>{
            return prod.product._id.toString() === prodId
        })
        // console.log(isInCart)
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity = isInCart.quantity - 1
                await carritoEncontrado.save()
                res.send(carritoEncontrado)
            }else{
                console.log('Igual a 1')
                //Arreglar filtro que no funciona
                const cartFilter = carritoEncontrado.products.filter(prod=> prod.product.toString() != isInCart.product)
                console.log(cartFilter)
                await carritoEncontrado.save()
                res.send(carritoEncontrado.products)
            }

        }
    } catch(e){
        return console.error(e)
    }

})

// router.delete('/:cId/product/:pId', async (req, res)=>{
//     const cartId = req.params.cId
//     const prodId = req.params.pId




// })

router.delete('/:cId', async(req, res)=>{
    const cartId = req.params.cId

    const carritoEncontrado = await cartModel.findById(cartId)
    if(carritoEncontrado.products.length === 0){
        console.log('if')
        return res.send({status: 'error', payLoad: `No existen productos en el carrito, ${carritoEncontrado.products}`})
    }else{
        carritoEncontrado.products = []
        await carritoEncontrado.save()
        return res.send({status: 'success', payLoad: `Productos eliminados correctamente`})
    }

})

router.put('/:cId/product/:pId', async(req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const quantity = parseInt(req.body.quantity)
        // console.log(quantity)
        
        const carritoEncontrado = await cartModel.findById(cartId)
        // const productoEncontrado = await prodModel.find({_id: prodId})

        // if(productoEncontrado === null){
        //     return res.send('No existe el producto')
        // }else{  
        const isRepeated = carritoEncontrado.products.find(prod =>{
            return prod.product._id.toString() === prodId
        })

        if(isRepeated){
            isRepeated.quantity += quantity
            await carritoEncontrado.save()
            res.send(carritoEncontrado)
        }else{
            res.send({status: 'error', payLoad: 'No existe ningun producto'})
        }
        // }
    }catch(e){
        return console.error(e)
    }

})

router.put('/:cId', async(req, res)=>{
    const cartId = req.params.cId

    const carritoEncontrado = await cartModel.findById(cartId)

    

})
export default router