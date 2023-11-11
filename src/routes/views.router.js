import {Router} from 'express'
import jwt from 'jsonwebtoken'

import {authorization, authToken, createHash } from '../utils.js'
import { productService, cartService, userService } from '../services/index.js'
import {getProductsViews, premiumView, getCartView, getProductView, mockingProducts, realTimeProducts} from '../controllers/views.controller.js'
import EErrors from '../services/errors/enums.js'

//.env config
import config from '../config/config.js'
import {logger} from '../services/logger/logger.js'
import CustomError from '../services/errors/customErrors.js'
import Mail from '../services/nodemailer/mail.js'

const router = Router()
const mail = new Mail()

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
    res.render('forgotPassword', {})
})

router.get('/resetPassword/:uId/:token', async(req, res)=>{
    const {uId, token} = req.params
    const user = await userService.getUserById(uId)
    if(!user){
        return res.send({status: 'error', payload: 'User not found'})
    }
    const secret = config.SECRET_JWT + user.password

    try {
        const payload = jwt.verify(token, secret)

        return res.render('resetPassword', {email: user.email})
    } catch (error) {
        const payload = {
            email: user.email,
            _id: user._id
        }
        const newSecret = config.SECRET_JWT + user.password
        const token = jwt.sign(payload, newSecret, {expiresIn: '1h'})
        const resetLink = `http://127.0.0.1:8080/resetPassword/${user._id}/${token}`
        let html = `The reset password link has been expired, creating a new one! You only got 1 hour to use it before it expires. ${resetLink} `
        mail.send(user, "Reset password link expired", html)
        return res.send({status: 'error', payload: `The link has already expired, creating a new one! Check your email.`})
    }

})
router.post('/resetPassword/:uId/:token', async(req, res)=>{
    const {uId, token} = req.params
    const user = await userService.getUserById(uId)
    const {password, confirmPassword} = req.body

    const secret = config.SECRET_JWT + user.password
    try {
        const payload = jwt.verify(token, secret)
        if(password === confirmPassword){
            const hashedPassword = createHash(password)
            if(hashedPassword === user.password){
                throw new Error('You cannot use the same password to change it')
            }   
            //Solucionar problema con el hash que no coincide con la contraseña antigua
            
            user.password = hashedPassword
            await userService.updateUser(user._id, user)
            return res.send({status: 'success', payload: 'Password changed successfully!'})
        }else{
            return res.send({status: 'error', payload: 'Passwords do not match, try again!'})
        }
        
    } catch (error) {
        return res.send({status: 'error', payload: error.message})
    }

})

export default router