import {Router} from 'express'

import {faker} from '@faker-js/faker/locale/es'

const router = Router()

router.get('/products', (req, res)=>{
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
    return res.send(products)
})

export default router