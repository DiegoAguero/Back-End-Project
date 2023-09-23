import {Router} from 'express'
import jwt from 'jsonwebtoken'

import prod from '../app.js'
import prodModel from '../dao/mongo/models/products.model.js'
import { extractCookie, authorization, authToken } from '../utils.js'
import cartModel from '../dao/mongo/models/cart.model.js'
import userModel from '../dao/mongo/models/user.model.js'
//.env config
import config from '../config/config.js'

const router = Router()


//Autenticacion para poder entrar solo si estas loggeado
function auth(req, res, next){
    const token = extractCookie(req)
    if(!token){ 
        return res.redirect('/')
    }
    jwt.verify(token, config.SECRET_JWT, (error, credentials) =>{
        if(error) return res.status(403).send({error: 'Not authorized / modified cookie'})
        
        console.log(credentials.user)
        req.user = credentials.user
        console.log("Authenticated!")
        return next()
    })
}

router.get('/realtimeproducts', authToken, authorization('admin'), async (req, res)=>{
    const totalProducts = await prodModel.find().lean().exec()
    req.session.touch()
    res.render('realTimeProducts', {totalProducts})
})
router.get('/products', authToken, async (req, res)=>{
    
    try{
        if(!req.user){
            throw new Error('Please, log in to see our products!')
        }
        //arreglar cartURL
        const page = parseInt(req.query?.page) || 1
        const limit = parseInt(req.query?.limit) || 10

        var cartId = req.user.cart
        const cartObtained = await cartModel.findById(cartId).populate('products.product').lean().exec()
        if(!cartObtained) throw new Error("The cart does not exist")

        const userFound = await userModel.find({email: req.user.email}).populate('cart').lean().exec()
        const {_id, first_name, email, last_name, age, cart, rol} = userFound[0]
        const user = {_id, first_name, email, last_name, age, cart, rol}


        const sortType = parseInt(req.query?.sort) || ''
        let sort = ''
        let sortCheck = ''

        const statusType = req.query?.status || ''
        let status = ''
        let statusCheck = ''

        let options = ''

        switch(sortType){
            case -1: sort = `&sort=-1`; sortCheck = -1; break;
            case 1: sort = `&sort=1`; sortCheck = 1; break;
            default: sort = ''; sortCheck = '';break;
        }
        
        switch(statusType){
            case 'true': status = '&status=true'; statusCheck = true; break;
            case 'false': status = '&status=false'; statusCheck = false; break;
            default: status = ''; statusCheck = ''; break;
        }
        
        if(sortCheck !== ''){
            options = {
                page,
                limit,
                sort:{
                    price: sortCheck
                },
                lean:true
            }
        }else{
            options = {
                page,
                limit,
                lean:true
            }
        }

        if(statusCheck !== ''){
            const statusFilter = {status: statusCheck}
            const totalProducts = await prodModel.paginate(statusFilter, options, (err, results)=>{
                if(err){ return console.log(err)}
                return results
            })

            totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}${sort}${status}` : ''
            totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}${sort}${status}` : ''

            // const userFound = await userModel.find({email: req.user.email}).populate('cart').lean().exec()
            // const {_id, first_name, email, last_name, age, cart, rol} = userFound[0]
            // const user = {_id, first_name, email, last_name, age, cart, rol}
            return res.render('home', ({result: 'success'}, {
                totalProducts: totalProducts,
                cartId: cartId,
                user: user
            }))

            // }
            // else{

            // }
        }
        const totalProducts = await prodModel.paginate({}, options, (err, results)=>{
            if(err){ return console.log(err)}
            return results
        })


        totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}${sort}${status}` : ''
        totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}${sort}${status}` : ''
        // const user = req.user

        
        let totalQuantity = 0
        cartObtained.products.forEach(product => {
            if(product.quantity == product.stock){
                console.log('Error: No puede agregar mas de este producto al carrito')
            }
            if(product.quantity > product.stock){
                console.log("Error: Tiene más cantidad que stock!, reseteando cantidad...")
                product.quantity = 0
            }
            console.log(product.quantity)
            totalQuantity += product.quantity               
        });
        //Pasar este valor por la navbar para cambiar la cantidad de productos que tiene en el carrito
        console.log('Total quantity: ' + totalQuantity)

        console.log(user)
        // console.log("User logeado: " + user)
        return res.render('home', ({result: 'success'}, {
            totalProducts: totalProducts,
            cartId: cartId,
            user: user
        }))

    }catch(e){
        return console.error(e)
    }
})
router.get('/products/:pId', async (req, res)=>{
    try{
        const pId = req.params.pId
        const product = await prod.getProductById(pId)
        // console.log(product)
        res.render('products', {product})
    }catch(e){
        return console.error(e)
    }

})
router.get('/cart/:cId', async (req, res)=>{
    try{
        const cId = req.params.cId
        const cart = await cartModel.findById(cId).populate('products.product').lean()

        // console.log(JSON.stringify(cart, null,'\t'))

        res.render('carts', {cart})
    }catch(e){
        return console.error(e)
    }
})
router.get('/chat', (req, res)=>{
    res.render('chat', {})
})



router.get('/', (req, res)=>{
    if(req.user){
        return res.redirect('/products')
    }
    // if(req.session?.user){
    //     res.redirect('/products')
    // }
    res.render('login', {})
})

router.get('/register', (req, res)=>{
    
    res.render('register', {})
})
export default router