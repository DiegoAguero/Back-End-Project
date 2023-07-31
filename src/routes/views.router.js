import {Router} from 'express'
import prodModel from '../dao/models/products.model.js'

const router = Router()

router.get('/realtimeproducts', async (req, res)=>{
    const totalProducts = await prodModel.find().lean().exec()
    res.render('realTimeProducts', {totalProducts})

})

router.get('/products', async (req, res)=>{
        const page = parseInt(req.query?.page) || 1
        const limit = parseInt(req.query?.limit) || 10
        const sort = parseInt(req.query?.sort) || -1
        // const query = req.query.query
        // const searchForQuery = await prodModel.find()
        // console.log("find",searchForQuery)

        // const sortByPrice = await prodModel.aggregate([
        //     {
        //         $sort:{
        //             price: sort
        //         }
        //     }
        // ])
        const sortByPrice = await prodModel.aggregate([
            {
                $sort: {
                    price: sort
                }
            }
        ]).exec();
        //Arreglar sort no se muestra en el array original
        const totalProducts = await prodModel.paginate(sortByPrice, {
            page,
            limit,
            lean: true
        })

        console.log(totalProducts)
        totalProducts.prevLink = totalProducts.hasPrevPage? `/products?page=${totalProducts.prevPage}&limit=${limit}&sort=${sort}` : ''
        totalProducts.nextLink = totalProducts.hasNextPage? `/products?page=${totalProducts.nextPage}&limit=${limit}&sort=${sort}`: ''
        
    // console.log({result: 'success'}, totalProducts)

    // const totalProducts = await prodModel.find().lean().exec()
    res.render('home', ({result: 'success'}, totalProducts))
})

router.get('/chat', (req, res)=>{
    
    res.render('chat', {})
})
export default router