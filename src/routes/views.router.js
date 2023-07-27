import {Router} from 'express'
import prodModel from '../dao/models/products.model.js'


const router = Router()

router.get('/realtimeproducts', async (req, res)=>{
    const totalProducts = await prodModel.find().lean().exec()
    res.render('realTimeProducts', {totalProducts})

})

router.get('/products', async (req, res)=>{
    const totalProducts = await prodModel.find().lean().exec()
    res.render('home', {totalProducts})
})

router.get('/chat', (req, res)=>{
    
    res.render('chat', {})
})
export default router