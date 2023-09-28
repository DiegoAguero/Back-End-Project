import {Router} from 'express'
import { createUser, getAllUsers, getUserByEmail } from '../controllers/users.controller.js'

const router = Router()

router.get('/', getAllUsers)
router.post('/', createUser)
router.get('/:email', getUserByEmail)

export default router