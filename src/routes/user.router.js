import {Router} from 'express'
import { changeUserRol, createUser, getAllUsers, getUserById } from '../controllers/users.controller.js'

const router = Router()

router.get('/', getAllUsers)
router.post('/', createUser)
router.get('/:uid', getUserById)
router.get('/premium/:uid', changeUserRol)

export default router