
import {cartService, productService} from '../services/index.js'


//seguir viendo videl del profesor min: 02:57:50
//codigo inservible hasta que apliquemos la capa de persistencia
//no iniciar

//El controller solamente debe pasar datos a la capa de negocio, osea al repository, luego ahí se hacen todas las preguntas
//Cambiar todo lo de findedProduct y toda esta pelotudez




export const createCart = async (req, res) =>{
    const createCart = await cartService.createCart()
    if(!createCart) return res.send({status: 'error', payload: 'Unexpected error: cart not created'})
    return res.send({status: 'success', createCart})
}

export const getCartById = async (req, res) =>{
    const id = req.params.cId
    const cart = await cartService.getCartById(id)
    console.log(cart)
    if(!cart) return res.send({status: 'error', payload: 'The cart does not exist.'})
    return res.send({status: 'success', cart})
}


export const addProductToCart = async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        
        const result = await cartService.addProductToCart(cartId, prodId)
        if(!result) return res.send({status: 'error', payload: 'Something inexpected happened adding a product'})
        return res.send({status: 'success', payload: result})        
        // const carritoEncontrado= await cartModel.findById(cartId)
        // const findedCart = await cartService.getCartById(cartId)
        // const findedProduct = await productManager.getProductById(prodId)
        // const productoEncontrado = await prodModel.findById(prodId)
        // if(findedProduct === undefined){
        //     return res.send('No existe el producto')
        // }else{  

        //     const isRepeated = findedCart.products.find(prod =>{
        //         return prod.product?._id.toString() === prodId
        //     })
        //     if(isRepeated){
        //         if(findedProduct.stock <= isRepeated.quantity){
        //             res.send({status: 'error', payLoad: 'No hay más stock de este producto'})
        //         }else{
        //             isRepeated.quantity++
        //             await findedCart.save()
                    
        //             //Cada vez que añado un producto al carrito de una manera u otra aparece este mensaje
        //             //"Cannot set headers after they are sent to the client", no me rompe el flujo del codigo 
        //             //Pero aparece cada vez que añado o elimino por el res.render
                    
        //             //Cuando añadis más de 1 producto del mismo, te va a llevar a la pagina del carrito

        //             // res.render('carts', {findedCart})
        //             // res.redirect(`/cart/${cartId}`)

        //             // res.send(findedCart)
        //             res.redirect('/products')

        //         }

        //     }else{
        //         findedCart.products.push({product: prodId})                
        //         await findedCart.save()
                
        //         res.redirect('/products')

        //     }
        // }

    }catch(error){
        throw new Error(error)
    }
}

export const deleteProductFromCart = async (req, res)=>{
    try{
        const {cartId} = req.params.cId
        const {prodId} = req.params.pId
        const findedCart = await cartService.getCartById(cartId)

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
}

export const deleteCart = async (req, res)=>{
    const cartId = req.params.cId
    const result = await cartService.deleteCart(cartId)
    if(!result) return res.send({status: 'error', payload: `There are no products in the cart at the moment.`})
    return res.send({status: 'success', payload: result})
    // const findedCart = await cartService.getCartById(cartId)
    // // const carritoEncontrado = aw ait cartModel.findById(cartId)
    // if(findedCart.products.length === 0){
    //     console.log('if')
    //     return res.send({status: 'error', payLoad: `No existen productos en el carrito`})
    // }else{
    //     findedCart.products = []
    //     await findedCart.save()
    //     return res.send({status: 'success', payLoad: `Productos eliminados correctamente`})
    // }
}

export const updateQuantityFromCart = async (req, res)=>{
    try{
        const {cartId} = req.params.cId
        const {prodId} = req.params.pId
        const quantity = parseInt(req.body.quantity)

        const findedCart = await cartService.getCartById(cartId)
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
}


export const updateCart = async (req, res)=>{
    try{
        const cartId = req.params.cId
        // const findedCart = await cartService.getCartById(cartId)
        // const carritoEncontrado = await cartModel.findById(cartId)
        const products = req.body.products
        const quantity = req.body.quantity
        const updateCart = await cartService.updateCart(cartId, products, quantity)
        if(!updateCart) return res.status(400).json({error: "There is a/many product/s that was/were not found/finded"})
        return res.status(201).json({message: 'Carrito actualizado con exito', updateCart})

        // if(findedCart){
        //     const updatedCartWithProducts = await cartService.updateCartWithArray(cartId, products, quantity)
        //     // await cartModel.findByIdAndUpdate(cartId, {products: products, quantity: 1})
        //     // console.log(updatedCartWithProducts)
        //     return res.status(201).json({message: 'Carrito actualizado con exito', updatedCartWithProducts})
        // }else{
        //     const createdCart = await cartModel.create({products: products, quantity: quantity})
        //     res.status(201).json({message: 'Carrito creado con los productos', createdCart})
        // }
    }catch(e){
        return console.error(e)
    }
}