import {Router} from 'express'
import { changeUserRol, createUser, getAllUsers, getUserById, getUserByEmail, resetPassword, uploadDocuments } from '../controllers/users.controller.js'
import { authToken, authorization } from '../utils.js'
import { uploadMiddleware } from '../middlewares/multer.middleware.js'
const router = Router()



router.get('/', authToken, authorization('admin'), getAllUsers)
router.post('/', authToken, authorization('admin'), createUser)
router.get('/email/:email', authToken, authorization('admin'), getUserByEmail)
router.get('/:uid', authToken, getUserById)
router.get('/premium/:uid', authToken, changeUserRol)
//Poner middleware de multer
router.post('/:uid/documents', uploadMiddleware, uploadDocuments)
router.post('/resetPassword', resetPassword)

export default router