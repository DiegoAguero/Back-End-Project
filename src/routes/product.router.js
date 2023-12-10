import {Router} from "express"
import { addProductToDatabase, deleteProduct, getProductByID, getProducts, updateProduct } from "../controllers/products.controller.js"
import { isPremium, authToken, authorization } from "../utils.js"

const router = Router()

router.get('/', authorization('admin'), getProducts)
router.post('/', authToken, isPremium, addProductToDatabase)
router.get('/:pId', authToken, getProductByID)
router.post('/delete/:pId', authorization('premium'), authorization('admin'), deleteProduct)

//postman
router.put('/:pId', authorization('admin'), updateProduct)
router.delete('/delete/:pId', deleteProduct)

export default router