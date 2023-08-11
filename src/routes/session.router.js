import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
const router = Router()

router.post('/login', async(req, res)=>{
    try {
        const {email, password} = req.body
        if(email == 'adminCoder@coder.com' && password == 'adminCod3r123'){
            const user = {email, password, rol: 'admin'}
            req.session.user = user
            return res.redirect('/products')
        }else{
            const user = await userModel.findOne({email, password})
            if(!user){
                return res.redirect('/login')
            }else{
                console.log("Se encontró un usuario")
                req.session.user = user
                return res.redirect('/products')
            }
        }
    } catch (error) {
        return console.error(error)
    }

})

router.post('/register', async(req, res)=>{
    try {
        const user = req.body
        await userModel.create(user)
        return res.redirect('/login')
    } catch (error) {
        return console.error(error)
    }

})

router.get('/logout', async(req, res)=>{
    try{
        if(req.session?.user){
            console.log("hola destruir sesion")
            req.session.destroy()
            return res.redirect('/login')
        }else{
            return res.redirect('/login')
        }
    }catch(e){
        return console.error(e)
    }

})
export default router