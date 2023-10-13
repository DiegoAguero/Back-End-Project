import {Router} from 'express'
import jwt from 'jsonwebtoken'
import {faker} from '@faker-js/faker/locale/es'

import { extractCookie, authorization, authToken } from '../utils.js'
import { productService, cartService, userService } from '../services/index.js'
import {getProductsViews, premiumView, getCartView, getProductView, mockingProducts, realTimeProducts} from '../controllers/views.controller.js'
import EErrors from '../services/errors/enums.js'

//.env config
import config from '../config/config.js'
import {logger} from '../services/logger/logger.js'
import CustomError from '../services/errors/customErrors.js'
const router = Router()


router.get('/realtimeproducts', authToken, authorization('admin'), realTimeProducts)
router.get('/products', authToken, getProductsViews)
router.get('/products/:pId', authToken, getProductView)
router.get('/cart/:cId', authToken, getCartView)
router.get('/mockingproducts', authorization('admin'), mockingProducts)
router.get('/premium', authToken, authorization('premium'), premiumView)

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

router.get('/resetPassword', async(req, res)=>{
    res.render('resetPassword', {})
})

router.get('/resetPassword/:uId/:token', async(req, res)=>{
    const user = await userService.getUserByEmail(req.params.uId.email)
    
    // const {uId, token} = req.params
    return res.send('hola estoy en la pagina')
    // return res.send({uId, token})
})

export default router