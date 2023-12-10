import {Router} from "express"
import { paymentIntent } from "../controllers/payments.controller.js"
import { authToken } from "../utils.js"

const router = Router()

router.post('/payment-intent', paymentIntent)

export default router
//terminar esto!