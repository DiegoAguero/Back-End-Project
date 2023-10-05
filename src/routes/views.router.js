import {Router} from 'express'
import jwt from 'jsonwebtoken'
import {faker} from '@faker-js/faker/locale/es'

import prod from '../app.js'
import prodModel from '../dao/mongo/models/products.model.js'
import { extractCookie, authorization, authToken } from '../utils.js'
import cartModel from '../dao/mongo/models/cart.model.js'
import userModel from '../dao/mongo/models/user.model.js'
import { productService, cartService, userService } from '../services/index.js'
import {getProductsViews} from '../controllers/views.controller.js'
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
    
    // const totalProducts = await prodModel.find().lean().exec()
    const totalProducts = await productService.getProducts()
    return res.render('realTimeProducts', {totalProducts})
})
router.get('/products', authToken, getProductsViews)

router.get('/products/:pId', async (req, res)=>{
    try{
        const pId = req.params.pId
        const product = await prod.getProductById(pId)
        res.render('products', {product})
    }catch(e){
        return console.error(e)
    }

})
router.get('/cart/:cId', async (req, res)=>{
    try{
        const cId = req.params.cId
        const cart = await cartService.getCartById(true, cId)
        // const cart = await cartModel.findById(cId).populate('products.product').lean()

        // console.log(JSON.stringify(cart, null,'\t'))

        return res.render('carts', {cart})
    }catch(e){
        return console.error(e)
    }
})
router.get('/chat', (req, res)=>{
    return res.render('chat', {})
})

router.get('/', (req, res)=>{
    if(req.user){
        return res.redirect('/products')
    }
    // if(req.session?.user){
    //     res.redirect('/products')
    // }
    return res.render('login', {})
})

router.get('/register', (req, res)=>{
    
    return res.render('register', {})
})
router.get('/mockingproducts', (req, res)=>{
    const products = []
    for (let i = 0; i < 100; i++) { 
        const newProduct = {
            _id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbnail: faker.image.avatar(),
            code:  faker.commerce.productAdjective(),
            stock:  faker.helpers.rangeToNumber({min: 1, max:20}),
            status: true
        }
        products.push(newProduct)
    }
    return res.render('mockingProducts', {totalProducts: products})
})
export default router