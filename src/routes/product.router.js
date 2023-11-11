import {Router} from "express"
import { addProductToDatabase, deleteProduct, getProductByID, getProducts, updateProduct } from "../controllers/products.controller.js"
import { isPremium } from "../utils.js"

const router = Router()

router.get('/', getProducts)
router.post('/', isPremium, addProductToDatabase)
router.get('/:pId', getProductByID)
router.post('/delete/:pId', deleteProduct)

//postman
router.put('/:pId', updateProduct)
router.delete('/delete/:pId', deleteProduct)

export default router