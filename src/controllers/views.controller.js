import {faker} from '@faker-js/faker/locale/es'
import jwt from 'jsonwebtoken'

import ViewManager from '../dao/mongo/views.mongo.js' 
import { productService, cartService } from '../services/index.js'
import config from '../config/config.js'
import CustomError from '../services/errors/customErrors.js'
import EErrors from '../services/errors/enums.js'
import {logger} from '../services/logger/logger.js'
import { userService } from '../services/index.js'
import { createHash } from '../utils.js'

const viewServices = new ViewManager()

export const getProductsViews = async (req, res)=>{
    try {
        const limit = parseInt(req.query?.limit || 5)
        const page = parseInt(req.query?.page || 1)
        const sort = parseInt(req.query?.sort || 1) 
        const status = req.query?.status || ''
        
        const user = req.user
        let products
        switch (config.PERSISTENCY) {
            case 'MONGO':
                products = await viewServices.getPaginatedProducts(limit, page, sort, status)
                break;
            case 'FILE':
                products = await productService.getProducts()
                break;
            default:
                break;
        }
        return res.status(201).render("home", {
            totalProducts: products,
            cartId: user.cart._id,
            user: user
        })

    } catch (error) {
        return console.error(error)
    }
}

export const premiumView = async (req, res)=>{
    const user = req.user
    const allProducts = await productService.getProducts()
    const productFilteredByOwner = allProducts.filter(product=>{ return product.owner === user.email })
    return res.status(201).render('createProduct', {user: user, totalProducts: productFilteredByOwner})
}

export const getCartView = async (req, res)=>{
    try{
        const cId = req.params.cId
        const cart = await cartService.getCartById(true, cId)
        req.logger.info(JSON.stringify(cart))
        return res.status(200).render('carts', {
            cart: cart,
        })
    }catch(e){
        CustomError.createError({
            name: "Get cart error",
            cause: e,
            message: "Error trying to get the cart",
            code: EErrors.DATABASES_ERROR
        })
    }
}

export const getProductView = async (req, res)=>{
    try{
        const pId = req.params.pId
        const product = await productService.getProductById(pId)
        return res.status(200).render('products', {product})
    }catch(e){
        CustomError.createError({
            name: "Get product error",
            cause: e,
            message: "Error trying to get the cart",
            code: EErrors.DATABASES_ERROR
        })
    }
}

export const mockingProducts = async (req, res)=>{
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
}

export const realTimeProducts = async (req, res)=>{
    const totalProducts = await productService.getProducts()
    return res.render('realTimeProducts', {totalProducts})
}

export const uploadDocumentsView = async (req, res)=>{
    const user = req.user
    return res.render('documents', {
        user: user
    })
}

export const chatView = async (req, res)=>{
    return res.render('chat', {})
}

export const loginView = async (req, res)=>{
    return res.render('login', {})
}

export const registerView = async (req, res)=>{
    return res.render('register', {})
}

export const forgotPasswordView = async (req, res)=>{
    return res.render('forgotPassword', {})
}

export const resetPasswordView = async (req, res)=>{
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
        const resetLink = `https://back-end-project-production-16e8.up.railway.app/resetPassword/${user._id}/${token}`
        let html = `The reset password link has been expired, creating a new one! You only got 1 hour to use it before it expires. ${resetLink} `
        mail.send(user, "Reset password link expired", html)
        return res.send({status: 'error', payload: `The link has already expired, creating a new one! Check your email.`})
    }
}

export const resetPasswordPostView = async (req, res)=>{
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
}

export const success = async (req, res)=>{
    return res.render('success', {})
}

export const cancel = async (req, res)=>{
    return res.render('cancel', {})
}