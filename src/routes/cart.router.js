// import cartManager from '../dao/CartManager.js'
import {Router} from 'express'
import cartModel from '../dao/models/cart.model.js'
import prodModel from '../dao/models/products.model.js'
// import productManager from '../app.js'
const router = Router()

router.get('/:cId', async (req, res)=>{
    try{
        const id = req.params.cId
        const cart = await cartModel.findOne({_id: id})
        .populate('products.product').exec()
        console.log(JSON.stringify(cart, null,'\t'))

        res.send({status: 'success', cart})
    }catch(e){
        return console.error(e)
    }

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
                return prod.product?._id.toString() === prodId
            })
            if(isRepeated){
                if(productoEncontrado.stock <= isRepeated.quantity){
                    res.send({status: 'error', payLoad: 'No hay más stock de este producto'})
                }else{
                    isRepeated.quantity++
                    await carritoEncontrado.save()
                    
                    //Cada vez que añado un producto al carrito de una manera u otra aparece este mensaje
                    //"Cannot set headers after they are sent to the client", no me rompe el flujo del codigo 
                    //Pero aparece cada vez que añado o elimino por el res.render
                    
                    //Cuando añadis más de 1 producto del mismo, te va a llevar a la pagina del carrito

                    res.render('carts', {carritoEncontrado})
                    res.redirect(`/cart/${cartId}`)

                    // res.send(carritoEncontrado)

                }

            }else{
                carritoEncontrado.products.push({product: prodId})                
                await carritoEncontrado.save()
                //Esto es una solución temporal para que no me saque de /products?cart=${cartId} y cree otro carrito nuevo
                //Lo hago de esta forma porque cada vez que añado un producto al carrito
                //Me manda a /api/carts/${cartId}/product/${prodId} y me borra el carrito de la URL
                //Entonces cuando volves para atras se vuelve a crear otro carrito nuevo, la función de esto
                //Es para que no se me creen muchos carritos cuando añado productos, de esta manera ya tengo el carrito
                //Salvado en la query

                res.render('products', {carritoEncontrado})
                res.redirect(`/products?cart=${cartId}`)

                // res.send(carritoEncontrado)
            }
        }

    }catch(error){
        throw new Error(error)
    }

})

router.delete('/:cId/product/:pId/delete', async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const carritoEncontrado = await cartModel.findById(cartId)

        const isInCart = carritoEncontrado.products.find(prod =>{
            return prod.product._id.toString() === prodId
        })
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity -= 1
                await carritoEncontrado.save()
                res.send(carritoEncontrado)
            }else{
                const cartFilter = carritoEncontrado.products.filter(prod=>{return prod.product != isInCart.product})
                carritoEncontrado.products = cartFilter
                await carritoEncontrado.save()
                res.send(carritoEncontrado)
            }

        }else{
            return res.send({status: 'error', payLoad: "No existe el producto en el array"})
        }
    } catch(e){
        return console.error(e)
    }

})

//Delete metodo POST para los forms
router.post('/:cId/product/:pId/delete', async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const carritoEncontrado = await cartModel.findById(cartId)

        const isInCart = carritoEncontrado.products.find(prod =>{
            return prod.product._id.toString() === prodId
        })
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity -= 1
                await carritoEncontrado.save()
                // res.send(carritoEncontrado)
                res.render('carts', {carritoEncontrado})
                res.redirect(`/cart/${cartId}`)
            }else{
                const cartFilter = carritoEncontrado.products.filter(prod=>{return prod.product != isInCart.product})
                carritoEncontrado.products = cartFilter
                await carritoEncontrado.save()
                // res.send(carritoEncontrado)
                res.render('carts', {carritoEncontrado})
                res.redirect(`/cart/${cartId}`)
            }

        }else{
            return res.send({status: 'error', payLoad: "No existe el producto en el array"})
        }
    } catch(e){
        return console.error(e)
    }

})

router.delete('/:cId', async(req, res)=>{
    const cartId = req.params.cId

    const carritoEncontrado = await cartModel.findById(cartId)
    if(carritoEncontrado.products.length === 0){
        console.log('if')
        return res.send({status: 'error', payLoad: `No existen productos en el carrito`})
    }else{
        carritoEncontrado.products = []
        await carritoEncontrado.save()
        return res.send({status: 'success', payLoad: `Productos eliminados correctamente`})
    }

})
//Actualizar cantidad de un producto añadido
router.put('/:cId/product/:pId', async(req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const quantity = parseInt(req.body.quantity)

        const carritoEncontrado = await cartModel.findById(cartId)

        const isRepeated = carritoEncontrado.products.find(prod =>{
            return prod.product?._id.toString() === prodId
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
    try{
        const cartId = req.params.cId
        const carritoEncontrado = await cartModel.findById(cartId)
        const products = req.body
        // const db = 'ecommerce'
        // const dbCollection = 'carts'
        // var bulk = await db.dbCollection.initializeUnorderedBulkOp()
        // console.log(bulk)
        //Pedirle ayuda al profesor! IMPORTANTE
        // const productosEncontrados = await prodModel.find({_id: product})
        products.forEach(async product=>{

            const productosEncontrados = await prodModel.find({_id: product.product})
            console.log(productosEncontrados)
            const isRepeated = carritoEncontrado.products.find(prod =>{
                return prod.product?._id === product.product
            })
            
            if(isRepeated){
                isRepeated.quantity += 1
                // 
                // bulk.insert({
                    // quantity: isRepeated.quantity
                // })
                // console.log(bulk)
                // console.log("repetido")
                // await carritoEncontrado.save()
                // res.send(carritoEncontrado)
            }else{
                carritoEncontrado.products.push({product: product})
                // res.send(carritoEncontrado)
            }
            // console.log(productosEncontrados)

            // console.log(product.product)
        })
        // bulk.execute();
        // console.log(bulk)
        
        // //Solucionar!!
        // carritoEncontrado.products.push({product: product})
        carritoEncontrado.save()
        res.send({status: 'success', payLoad: carritoEncontrado})
    }catch(e){
        return console.error(e)
    }

    // const products = req.body

    // const addedProduct = await prodModel.addedProduct(req.body)  
    // console.log(addedProduct)    
    // const isInCart = carritoEncontrado.products.product  
})
export default router