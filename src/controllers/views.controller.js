import {faker} from '@faker-js/faker/locale/es'

import ViewManager from '../dao/mongo/views.mongo.js' 
import { productService, cartService } from '../services/index.js'
import config from '../config/config.js'
import CustomError from '../services/errors/customErrors.js'
import EErrors from '../services/errors/enums.js'
import {logger} from '../services/logger/logger.js'
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