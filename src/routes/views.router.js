import {Router} from 'express'
import prod from '../app.js'


const router = Router()

router.get('/realtimeproducts', (req, res)=>{
    const totalProducts = prod.getProducts()
    res.render('realTimeProducts', {totalProducts})
    
})

router.get('/products',  (req, res)=>{
    const totalProducts = prod.getProducts()
    res.render('home', {totalProducts})
})
export default router