import {Router} from 'express'
import { changeUserRol, createUser, getAllUsers, getUserById, getUserByEmail, resetPassword } from '../controllers/users.controller.js'

const router = Router()

router.get('/', getAllUsers)
router.post('/', createUser)
router.get('/email/:email', getUserByEmail)
router.get('/:uid', getUserById)
router.get('/premium/:uid', changeUserRol)

router.post('/resetPassword', resetPassword)
export default router