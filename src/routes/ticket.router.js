import {Router} from 'express'
import { createTicket, getTicketByCode } from '../controllers/tickets.controller.js'
import { authorization } from '../utils.js'
const router = Router()

router.post('/', authorization('admin'), createTicket)
router.get('/:code', authorization('admin'), getTicketByCode)

export default router
