import ViewManager from '../dao/mongo/views.mongo.js' 
import prodModel from '../dao/mongo/models/products.model.js'
import { productService } from '../services/index.js'
import config from '../config/config.js'
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
                JSON.stringify(products)
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
    console.log(productFilteredByOwner)
    return res.render('createProduct', {user: user, totalProducts: productFilteredByOwner})
}
