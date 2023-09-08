import {Router} from 'express'
import cartModel from '../dao/models/cart.model.js'
// import prodModel from '../dao/models/products.model.js'
import CartManager from '../dao/CartManager.js'
import ProductManager from '../dao/ProductManager.js'
// import productManager from '../app.js'
const router = Router()
const cartManager = new CartManager()
const productManager = new ProductManager()
router.get('/:cId', async (req, res)=>{
    try{
        const id = req.params.cId
        // const cart = await cartModel.findOne({_id: id})
        // .populate('products.product').exec()\
        const cart = await cartManager.getCartById(id)
        if(!cart) return res.send({status: 'error', payLoad: 'The cart does NOT exist.'})
        console.log(JSON.stringify(cart, null,'\t'))

        res.send({status: 'success', cart})
    }catch(e){
        return console.error(e)
    }

})

router.post ('/', async (req, res)=>{
    // const newCart = {
        // product: []
    // }
    // const createCart = await cartModel.create(newCart)
    const createCart = await cartManager.createCart()
    res.send({createCart, status: 'success'})
})

router.post('/:cId/product/:pId', async (req, res)=>{
    try{
        req.session.touch()
        const cartId = req.params.cId
        const prodId = req.params.pId

        // const carritoEncontrado = await cartModel.findById(cartId)
        const findedCart = await cartManager.getCartById(cartId)
        const findedProduct = await productManager.getProductById(prodId)
        // const productoEncontrado = await prodModel.findById(prodId)
        if(findedProduct === undefined){
            return res.send('No existe el producto')
        }else{  

            const isRepeated = findedCart.products.find(prod =>{
                return prod.product?._id.toString() === prodId
            })
            if(isRepeated){
                if(findedProduct.stock <= isRepeated.quantity){
                    res.send({status: 'error', payLoad: 'No hay más stock de este producto'})
                }else{
                    isRepeated.quantity++
                    await findedCart.save()
                    
                    //Cada vez que añado un producto al carrito de una manera u otra aparece este mensaje
                    //"Cannot set headers after they are sent to the client", no me rompe el flujo del codigo 
                    //Pero aparece cada vez que añado o elimino por el res.render
                    
                    //Cuando añadis más de 1 producto del mismo, te va a llevar a la pagina del carrito

                    // res.render('carts', {findedCart})
                    // res.redirect(`/cart/${cartId}`)

                    // res.send(findedCart)
                    res.redirect('/products')

                }

            }else{
                findedCart.products.push({product: prodId})                
                await findedCart.save()
                //Esto es una solución temporal para que no me saque de /products?cart=${cartId} y cree otro carrito nuevo
                //Lo hago de esta forma porque cada vez que añado un producto al carrito
                //Me manda a /api/carts/${cartId}/product/${prodId} y me borra el carrito de la URL
                //Entonces cuando volves para atras se vuelve a crear otro carrito nuevo, la función de esto
                //Es para que no se me creen muchos carritos cuando añado productos, de esta manera ya tengo el carrito
                //Salvado en la query
                
                res.redirect('/products')

                // res.render('products', {findedCart})
                // res.redirect(`/products?cart=${cartId}`)

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
        const findedCart = await cartManager.getCartById(cartId)
        // const carritoEncontrado = await cartModel.findById(cartId)

        const isInCart = findedCart.products.find(prod =>{
            return prod.product._id.toString() === prodId
        })
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity -= 1
                await findedCart.save()
                res.send(findedCart)
            }else{
                const cartFilter = findedCart.products.filter(prod=>{return prod.product != isInCart.product})
                findedCart.products = cartFilter
                await findedCart.save()
                res.send(findedCart)
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
        const findedCart = await cartManager.getCartById(cartId)

        // const carritoEncontrado = await cartModel.findById(cartId)

        const isInCart = findedCart.products.find(prod =>{
            return prod.product._id.toString() === prodId
        })
        if(isInCart){
            if(isInCart.quantity > 1){
                isInCart.quantity -= 1
                await findedCart.save()
                // res.send(carritoEncontrado)
                res.render('carts', {findedCart})
                res.redirect(`/cart/${cartId}`)
            }else{
                const cartFilter = findedCart.products.filter(prod=>{return prod.product != isInCart.product})
                findedCart.products = cartFilter
                await findedCart.save()
                // res.send(carritoEncontrado)
                res.render('carts', {findedCart})
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
    const findedCart = await cartManager.getCartById(cartId)
    // const carritoEncontrado = await cartModel.findById(cartId)
    if(findedCart.products.length === 0){
        console.log('if')
        return res.send({status: 'error', payLoad: `No existen productos en el carrito`})
    }else{
        findedCart.products = []
        await findedCart.save()
        return res.send({status: 'success', payLoad: `Productos eliminados correctamente`})
    }

})
//Actualizar cantidad de un producto añadido
router.put('/:cId/product/:pId', async(req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const quantity = parseInt(req.body.quantity)

        const findedCart = await cartManager.getCartById(cartId)
        // const carritoEncontrado = await cartModel.findById(cartId)

        const isRepeated = findedCart.products.find(prod =>{
            return prod.product?._id.toString() === prodId
        })

        if(isRepeated){
            isRepeated.quantity += quantity
            await findedCart.save()
            res.send(findedCart)
        }else{
            
            res.send({status: 'error', payLoad: 'No existe ningun producto'})
        }
    }catch(e){
        return console.error(e)
    }

})

router.put('/:cId', async(req, res)=>{
    try{
        const cartId = req.params.cId
        const findedCart = await cartManager.getCartById(cartId)
        // const carritoEncontrado = await cartModel.findById(cartId)
        const products = req.body.products
        const quantity = 1
        if(findedCart){
            const updatedCartWithProducts = await cartManager.updateCartWithArray(cartId, products, quantity)
            // await cartModel.findByIdAndUpdate(cartId, {products: products, quantity: 1})
            // console.log(updatedCartWithProducts)
            return res.status(201).json({message: 'Carrito actualizado con exito', updatedCartWithProducts})
        }else{
            const createdCart = await cartModel.create({products: products, quantity: 1})
            res.status(201).json({message: 'Carrito creado con los productos', createdCart})
        }
    }catch(e){
        return console.error(e)
    }

})
export default router