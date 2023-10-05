import {Router} from 'express'
import { createTicket, getTicketByCode } from '../controllers/tickets.controller.js'
const router = Router()

router.post('/', createTicket)
router.get('/:code', getTicketByCode)

export default router
