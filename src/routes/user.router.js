import {Router} from 'express'
import { changeUserRol, createUser, getAllUsers, getUserById, getUserByEmail, resetPassword, uploadDocuments, deleteUsers, deleteUserById } from '../controllers/users.controller.js'
import { authToken, authorization } from '../utils.js'
import { uploadMiddleware } from '../middlewares/multer.middleware.js'
const router = Router()

router.get('/', authToken, authorization('admin'), getAllUsers)
router.post('/', authToken, authorization('admin'), createUser)
router.get('/email/:email', authToken, authorization('admin'), getUserByEmail)
router.get('/:uid', authToken, getUserById)
router.get('/premium/:uid', authToken, changeUserRol)
router.post('/:uid/documents', authToken, uploadMiddleware, uploadDocuments)
router.post('/resetPassword', resetPassword)
router.delete('/:uid', authorization('admin'), authToken, deleteUserById)
router.delete('/', authorization('admin'), authToken, deleteUsers)

export default router