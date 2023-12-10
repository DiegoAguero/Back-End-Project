import {Router} from 'express'
import { addProductToCart, purchaseProducts, deleteProductFromCart, getCartById, updateCart, updateQuantityFromCart, createCart, clearCart, getAllCarts } from '../controllers/carts.controller.js'
import { authToken, authorization } from '../utils.js'


const router = Router()

router.post('/', authorization('admin'), createCart)
router.get('/', authorization('admin'), getAllCarts)
router.get('/:cId', getCartById)
router.post('/:cId/product/:pId', addProductToCart)
router.post('/:cId/product/:pId/delete', deleteProductFromCart)
router.post('/:cId', clearCart)
router.post('/:cId/purchase', authToken, purchaseProducts)
router.delete('/:cId/product/:pId/delete', deleteProductFromCart)
router.put('/:cId/product/:pId', updateQuantityFromCart)
router.delete('/:cId', clearCart)
router.put('/:cId', updateCart)

export default router