import {Router} from 'express'

import {authorization, authToken } from '../utils.js'
import {getProductsViews, premiumView, getCartView, getProductView, mockingProducts, realTimeProducts, uploadDocumentsView, chatView, loginView, registerView, forgotPasswordView, resetPasswordView, resetPasswordPostView, success} from '../controllers/views.controller.js'


const router = Router()

router.get('/realtimeproducts', authToken, authorization('admin'), realTimeProducts)
router.get('/products', authToken, getProductsViews)
router.get('/products/:pId', authToken, getProductView)
router.get('/cart/:cId', authToken, getCartView)
router.get('/user/:uid/documents', authToken, uploadDocumentsView)
router.get('/mockingproducts', authorization('admin'), mockingProducts)
router.get('/premium', authToken, authorization('premium'), premiumView)
router.get('/chat', authToken, chatView)
router.get('/', loginView)
router.get('/register', registerView)
router.get('/resetPassword', forgotPasswordView)
router.get('/resetPassword/:uId/:token', resetPasswordView)
router.post('/resetPassword/:uId/:token', resetPasswordPostView)
router.get('/success', authToken, success)
export default router