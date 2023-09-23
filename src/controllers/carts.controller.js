
import {cartService, productService} from '../services/index.js'

//El controller solamente debe pasar datos a la capa de negocio, osea al repository, luego ahí se hacen todas las preguntas
//Cambiar todo lo de findedProduct y toda esta pelotudez


export const createCart = async (req, res) =>{
    const createCart = await cartService.createCart()
    if(!createCart) return res.send({status: 'error', payload: 'Unexpected error: cart not created'})
    return res.send({status: 'success', payload: createCart})
}

export const getCartById = async (req, res) =>{
    const id = req.params.cId
    const cart = await cartService.getCartById(id)
    console.log(cart)
    // res.render('carts', {cart})
    if(!cart) return res.send({status: 'error', payload: 'The cart does not exist.'})

}
export const getCartByIdPopulated = async (req, res)=>{
    const id = req.params.cId
    const cart = await cartService.getCartByIdPopulated(id)
    console.log(cart)
    return res.render('carts', {cart})
    // return res.send({cart})
    // return res.render('carts', {cart})

}
export const getCarts = async (req, res)=>{
    try{
        return await cartService.getCarts()
    }catch(e){
        throw new Error(e)
    }
}
export const addProductToCart = async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const result = await cartService.addProductToCart(cartId, prodId)
        console.log(result)
        if(!result) return res.send({status: 'error', payload: 'Something inexpected happened adding a product'})
        res.redirect(`/api/carts/${cartId}`)
        return res.render('carts', {result})
        // return res.send({status: 'success', payload: result})        
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

export const clearCart = async (req, res)=>{
    const cartId = req.params.cId
    const cart = cartService.getCartById(cartId)
    const result = await cartService.clearCart(cartId)
    if(cart.products?.length === 0) return res.send({status: 'error', payload: 'There are no products in the cart at the moment.'})
    if(!result) return res.send({status: 'error', payload: 'Error clearing the products'})
    return res.send({status: 'success', payload: result})        

}

export const deleteProductFromCart = async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        // const carritoEncontrado = await cartModel.findById(cartId)
        const result = await cartService.deleteProductFromCart(cartId, prodId)
        if(!result) return res.send({status: 'error', payload: 'There has been a problem deleting a product from your cart'})
        res.redirect(`/api/carts/${cartId}`)
        return res.render('carts', {result})
        // return res.send({status: 'success', payload: result})

    } catch(e){
        return console.error(e)
    }
}

export const deleteCart = async (req, res)=>{
    const cartId = req.params.cId
    const result = await cartService.deleteCart(cartId)
    console.log(result)
    if(!result) return res.send({status: 'error', payload: `Inexpected error by trying to delete the cart`})
    return res.send({status: 'success', payload: result})

}

export const updateQuantityFromCart = async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const quantity = parseInt(req.body.quantity)

        const findedCart = await cartService.getCartById(cartId)
        // const carritoEncontrado = await cartModel.findById(cartId)

        const isRepeated = findedCart.products.find(prod =>{
            return prod.product?._id.toString() === prodId
        })

        if(isRepeated){
            isRepeated.quantity += quantity
            await findedCart.save()
            res.send({status: 'success', payload: findedCart})
            return res.render('carts', {result})

        }else{
            return res.send({status: 'error', payLoad: 'No existe ningun producto'})
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

        const updateCart = await cartService.updateCart(cartId, products)
        if(!updateCart) return res.status(400).json({error: "There is a/many product/s that was/were not found/finded"})
        return res.status(201).json({message: 'Carrito actualizado con exito', updateCart})

    }catch(e){
        return console.error(e)
    }
}

export const purchaseProducts = async (req, res)=>{
    try {
        const cartId = req.params.cId
        console.log('CartID: ', cartId)
        const userEmail = req.user?.email || ""
        return await cartService.purchaseProducts(cartId, userEmail)
    } catch (error) {
        throw new Error(error)
    }
}