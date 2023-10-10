
import {cartService, productService} from '../services/index.js'
//El controller solamente debe pasar datos a la capa de negocio, osea al repository, luego ahí se hacen todas las preguntas
//Cambiar todo lo de findedProduct y toda esta pelotudez


export const createCart = async (req, res) =>{
    const cart = req.body
    const createCart = await cartService.createCart(cart)
    if(!createCart) return res.send({status: 'error', payload: 'Unexpected error: cart not created'})
    return res.send({status: 'success', payload: createCart})
}
export const getAllCarts = async (req, res)=>{
    try {
        let populate = req.query?.populate ?? false
        populate = populate === "false" ? false : true
        const allCarts = await cartService.getAllCarts(populate)
        res.send({status: 'success', payload: allCarts})
    } catch (error) {
        return req.logger.error(error)
    }
}
export const getCartById = async (req, res) =>{
    const id = req.params.cId
    const cart = await cartService.getCartById(true, id)
    
    req.logger.info(JSON.stringify(cart))
    if(!cart) return res.send({status: 'error', payload: 'The cart does not exist.'})
    return res.render('carts', {cart})

}


export const addProductToCart = async (req, res)=>{
    try{
        const cartId = req.params.cId
        const prodId = req.params.pId
        const user = req.user
        if(user.rol === 'premium'){
            const allProducts = await productService.getProducts()
            const productFilteredByOwner = allProducts.filter(product=>{ return product.owner === user.email })
            if(productFilteredByOwner >= 1){
                const ownerProduct = productFilteredByOwner.find(product => product._id.toString() === prodId.toString())
                req.logger.info(ownerProduct)
                return res.send({status: 'error', payload: 'You cant add your own product to the cart!'})
            }
        }
        const result = await cartService.addProductToCart(cartId, prodId)
        req.logger.info(result)
        if(!result) return res.send({status: 'error', payload: 'Something inexpected happened adding a product'})
        // return res.send({status: 'success', payload: result})
        res.redirect(`/api/carts/${cartId}`)
        return res.render('carts', result)

    }catch(error){
        throw new Error(error)
    }
}

export const clearCart = async (req, res)=>{
    const cartId = req.params.cId
    const cart = await cartService.getCartById(cartId)
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
        req.logger.info(result)
        if(!result) return res.send({status: 'error', payload: 'There has been a problem deleting a product from your cart'})
        // res.redirect(`/api/carts/${cartId}`)
        // res.send({result})
        res.redirect(`/api/carts/${cartId}`)
        return res.render('carts', {result})
        // return res.send({status: 'success', payload: result})

    } catch(e){
        return req.logger.error(e)
    }
}

export const deleteCart = async (req, res)=>{
    const cartId = req.params.cId
    const result = await cartService.deleteCart(cartId)
    req.logger.info(result)
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
            await cartService.updateCart(cartId, findedCart.products)
            // await findedCart.save()
            req.logger.info(findedCart)
            return res.send({status: 'success', payload: findedCart})
            // return res.render('carts', {findedCart})

        }else{
            return res.send({status: 'error', payLoad: 'No existe ningun producto'})
        }
    }catch(e){
        return req.logger.error(e)
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
        return req.logger.error(e)
    }
}

export const purchaseProducts = async (req, res)=>{
    try {
        const cartId = req.params.cId
        const userEmail = req.user?.email || req.body.email

        const ticket = await cartService.purchaseProducts(cartId, userEmail)
        req.logger.info(ticket)
        return res.send({status: 'success', payload: ticket})
    } catch (error) {
        return req.logger.error(error)
    }
}