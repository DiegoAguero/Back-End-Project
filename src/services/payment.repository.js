import Stripe from 'stripe'
import config from '../config/config.js'
//private key from stripe webpage

const key = config.STRIPE_PRIVATE_KEY


export default class PaymentService{
    constructor(){
        this.stripe = new Stripe(key)
    }
    createPaymentIntent = async(products)=>{
        const pay = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(product=>{
                return {
                    price_data:{
                        currency: 'usd',
                        product_data: {
                            name: product.name
                        },
                        unit_amount_decimal: parseFloat(product.price * 100)
                    },
                    quantity: product.quantity
                }
            }),
            mode: 'payment',
            success_url: 'http://127.0.0.1:8080/success',
            cancel_url: 'http://127.0.0.1:8080/cancel'
        })
        return pay
    }

}