import {Router} from 'express'
import CartManager from '../dao/mongo/CartManager.js'
import ProductManager from '../dao/mongo/ProductManager.js'
import { addProductToCart, purchaseProducts, deleteProductFromCart, getCartById, updateCart, updateQuantityFromCart, createCart, clearCart, getAllCarts } from '../controllers/carts.controller.js'


const router = Router()

router.post('/', createCart)
router.get('/', getAllCarts)
router.get('/:cId', getCartById)
router.post('/:cId/product/:pId', addProductToCart)
router.post('/:cId/product/:pId/delete', deleteProductFromCart)
router.post('/:cId', clearCart)

router.post('/:cId/purchase', purchaseProducts)
//postman
router.delete('/:cId/product/:pId/delete', deleteProductFromCart)
router.put('/:cId/product/:pId', updateQuantityFromCart)
router.delete('/:cId', clearCart)
router.put('/:cId', updateCart)

export default router