import PaymentService from "../services/payment.repository.js"
const paymentService = new PaymentService()
export const paymentIntent = async (req, res)=>{
    const products = req.body.products
    try{
        //Products must have: Name, price and quantity
        const pay = await paymentService.createPaymentIntent(products)
        res.send({status: 'success', payload: pay})
    }catch(err){
        console.error(err.message)
    }
}