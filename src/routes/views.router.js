import {Router} from 'express'
import jwt from 'jsonwebtoken'

import {authorization, authToken, createHash } from '../utils.js'
import { productService, cartService, userService } from '../services/index.js'
import {getProductsViews, premiumView, getCartView, getProductView, mockingProducts, realTimeProducts, uploadDocumentsView, chatView, loginView, registerView, forgotPasswordView, resetPasswordView, resetPasswordPostView} from '../controllers/views.controller.js'
import EErrors from '../services/errors/enums.js'

//.env config
import config from '../config/config.js'
import {logger} from '../services/logger/logger.js'
import CustomError from '../services/errors/customErrors.js'
import Mail from '../services/nodemailer/mail.js'

const router = Router()
const mail = new Mail()

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


export default router