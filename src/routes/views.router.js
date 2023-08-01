import {Router} from 'express'
import prodModel from '../dao/models/products.model.js'

const router = Router()

router.get('/realtimeproducts', async (req, res)=>{
    const totalProducts = await prodModel.find().lean().exec()
    res.render('realTimeProducts', {totalProducts})

})

router.get('/products', async (req, res)=>{
    try{

    
        const page = parseInt(req.query?.page) || 1
        const limit = parseInt(req.query?.limit) || 10
        const sort = parseInt(req.query?.sort) || -1

        const sortByPrice = await prodModel.aggregate([
            {
                $sort: {
                    price: sort
                }
            }
        ]).exec();

        const options = {
            page,
            limit,
            sort:{
                price: sort
            },
            lean:true
        }
        const totalProducts = await prodModel.paginate({}, options, (err, results)=>{
            if(err){ console.log(err)}
            return results
        })

        totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}&sort=${sort}` : ''
        totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}&sort=${sort}`: ''
        
        res.render('home', ({result: 'success'}, totalProducts))
    }catch(e){
        return console.error(e)
    }
})

router.get('/chat', (req, res)=>{
    
    res.render('chat', {})
})
export default router