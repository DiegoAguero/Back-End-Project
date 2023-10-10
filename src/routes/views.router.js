import {Router} from 'express'
import jwt from 'jsonwebtoken'
import {faker} from '@faker-js/faker/locale/es'

import { extractCookie, authorization, authToken } from '../utils.js'
import { productService, cartService, userService } from '../services/index.js'
import {getProductsViews, premiumView} from '../controllers/views.controller.js'

//.env config
import config from '../config/config.js'
import {logger} from '../services/logger/logger.js'
const router = Router()


//Autenticacion para poder entrar solo si estas loggeado
// function auth(req, res, next){
//     const token = extractCookie(req)
//     if(!token){ 
//         return res.redirect('/')
//     }
//     jwt.verify(token, config.SECRET_JWT, (error, credentials) =>{
//         if(error) return res.status(403).send({error: 'Not authorized / modified cookie'})
        
//         logger.info(credentials.user)
//         req.user = credentials.user
//         logger.info("Authenticated!")
//         return next()
//     })
// }

router.get('/realtimeproducts', authToken, authorization('admin'), async (req, res)=>{
    
    const totalProducts = await productService.getProducts()
    return res.render('realTimeProducts', {totalProducts})
})
router.get('/products', authToken, getProductsViews)

router.get('/products/:pId', async (req, res)=>{
    try{
        const pId = req.params.pId
        const product = await productService.getProductById(pId)
        res.render('products', {product})
    }catch(e){
        return logger.error(e)
    }

})
router.get('/cart/:cId', async (req, res)=>{
    try{
        const cId = req.params.cId
        const cart = await cartService.getCartById(true, cId)
        req.logger.info(cart
            )
        // const cart = await cartModel.findById(cId).populate('products.product').lean()
        return res.render('carts', {cart})
    }catch(e){
        return logger.error(e)
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

router.get('/premium', authToken, authorization('premium'), premiumView)
export default router