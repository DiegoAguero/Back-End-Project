import {Router} from "express"
import { addProductToDatabase, deleteProduct, getProductByID, getProducts, updateProduct } from "../controllers/products.controller.js"


const router = Router()

router.get('/', getProducts)
router.post('/', addProductToDatabase)
router.get('/:pId', getProductByID)
router.post('/delete/:pId', deleteProduct)

//postman
router.put('/:pId', updateProduct)
router.delete('/delete/:pId', deleteProduct)

export default router