import {Router} from 'express'
import prodModel from '../dao/models/products.model.js'
import prod from '../app.js'
import cartModel from '../dao/models/cart.model.js'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { extractCookie } from '../utils.js'
import userModel from '../dao/models/user.model.js'
const router = Router()

dotenv.config({path: '.env'})

const SECRET_JWT = process.env.SECRET_JWT

//Modificar todo el archivo de views.router para que no se cree otro carrito todo el tiempo!

//Autenticacion para poder entrar solo si estas loggeado
function auth(req, res, next){
    const token = extractCookie(req)
    if(!token){ 
        return res.redirect('/')
    }
    jwt.verify(token, SECRET_JWT, (error, credentials) =>{
        if(error) return res.status(403).send({error: 'Not authorized / modified cookie'})
        
        console.log(credentials.user)
        req.user = credentials.user
        console.log("Authenticated!")
        return next()
    })
}

router.get('/realtimeproducts', auth, async (req, res)=>{
    const totalProducts = await prodModel.find().lean().exec()
    res.render('realTimeProducts', {totalProducts})
})
router.get('/products', async (req, res)=>{
    
    try{
        //arreglar cartURL
        const page = parseInt(req.query?.page) || 1
        const limit = parseInt(req.query?.limit) || 10

        var cartId = req.user?.cart || '64c68a91456f4b467584190f'
        // Bypass de este error: "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer"
        // Será temporal hasta que encuentre la solucion
        const cart = await cartModel.findById(cartId).populate('products.product').lean() || ''
        var cartUrl = ''

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
            if(cart){
                const statusFilter = {status: statusCheck}
                const totalProducts = await prodModel.paginate(statusFilter, options, (err, results)=>{
                    if(err){ return console.log(err)}
                    return results
                })

                cartUrl = `&cart=${cartId}`
                totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}${sort}${status}${cartUrl}` : ''
                totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}${sort}${status}${cartUrl}` : ''
                if(req.user){
                    const user = req.user
                    res.render('home', ({result: 'success'}, {
                        totalProducts: totalProducts,
                        cartId: cartId,
                        user: user
                    }))
                }
                else{
                    res.render('home', ({result: 'success'}, {
                        totalProducts: totalProducts,
                        // cartId: cartId                
                    })) 
                }
            }else{
                const statusFilter = {status: statusCheck}
                const totalProducts = await prodModel.paginate(statusFilter, options, (err, results)=>{
                    if(err){ return console.log(err)}
                    return results
                })
                // const newCart = {
                    // product: []
                // }
                // const createCart = await cartModel.create(newCart)
                // console.log(createCart)
                // cartUrl = `&cart=${createCart._id}`
                // cartId = createCart._id
                totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}${sort}${status}${cartUrl}` : ''
                totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}${sort}${status}${cartUrl}` : ''

                if(req.user){
                    const user = req.user
                    
                    res.render('home', ({result: 'success'}, {
                        totalProducts: totalProducts,
                        cartId: cartId,
                        user: user
                    }))
                }
                else{
                    res.render('home', ({result: 'success'}, {
                        totalProducts: totalProducts,
                        // cartId: cartId                
                    })) 
                }
            }

        }
        if(cart){
            const totalProducts = await prodModel.paginate({}, options, (err, results)=>{
                if(err){ return console.log(err)}
                return results
            })

            cartUrl = `&cart=${cartId}`

            totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}${sort}${status}${cartUrl}` : ''
            totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}${sort}${status}${cartUrl}` : ''
            if(req.user){
                // const user = req.user
                const user = await userModel.find({email: req.user.email}).populate('cart').lean().exec()
                console.log("User logeado: " + user)
                res.render('home', ({result: 'success'}, {
                    totalProducts: totalProducts,
                    cartId: cartId,
                    user: user
                }))
            }
            else{
                res.render('home', ({result: 'success'}, {
                    totalProducts: totalProducts,
                    cartId: cartId                
                })) 
            }
        }else{
            const totalProducts = await prodModel.paginate({}, options, (err, results)=>{
                if(err){ return console.log(err)}
                return results
            })
            // const newCart = {
                // product: []
            // }
            // const createCart = await cartModel.create(newCart)
            // cartUrl = `&cart=${createCart._id}`
            // cartId = createCart._id
            totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}${sort}${status}${cartUrl}` : ''
            totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}${sort}${status}${cartUrl}` : ''
            if(req.user){
                // const user = req.user
                const user = await userModel.find({email: req.user.email}).populate('cart').lean()

                console.log("User logeado: " + JSON.stringify(user))


                res.render('home', ({result: 'success'}, {
                    totalProducts: totalProducts,
                    cartId: cartId,
                    user: user
                }))
            }
                else{
                    res.render('home', ({result: 'success'}, {
                        totalProducts: totalProducts,
                        // cartId: cartId                
                    })) 
                }

        }

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
    if(req.session?.user){
        res.redirect('/products')
    }
    res.render('login', {})
})

router.get('/register', (req, res)=>{
    
    res.render('register', {})
})
export default router