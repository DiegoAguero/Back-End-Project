import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import passport from 'passport'

const router = Router()

router.post('/login', 
    passport.authenticate('login', '/login'),
    async(req, res)=>{
    try {
        if(!req.user){
            return res.status(400).send('Invalid Credentials')
        }else{
            req.session.user = req.user
            return res.redirect('/')
        }
        // const {email, password} = req.body
        // if(email == 'adminCoder@coder.com' && password == 'adminCod3r123'){
        //     const user = {email, password, rol: 'admin'}
        //     req.session.user = user
        //     return res.redirect('/products')
        // }else{
        //     const user = await userModel.findOne({email, password})
        //     if(!user){
        //         return res.redirect('/login')
        //     }else{
        //         console.log("Se encontró un usuario")
        //         req.session.user = user
        //         return res.redirect('/products')
        //     }
        // }

    } catch (error) {
        return console.error(error)
    }

})

router.post('/register', 
    passport.authenticate('register', {failureRedirect: '/register'}),
    async(req, res)=>{
    try {
        // const user = req.body
        // await userModel.create(user)
        return res.redirect('/')

    } catch (error) {
        return console.error(error)
    }
})


router.get('/logout', async(req, res)=>{
    try{
        if(req.session?.user){
            req.session.destroy()
            return res.redirect('/')
        }else{
            return res.redirect('/')
        }
    }catch(e){
        return console.error(e)
    }

})

//Gituhb route
router.get(
    '/login-github',
    passport.authenticate('github', {scope: ['user:email']})
)

router.get(
    '/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/'}), 
    async (req, res)=>{
        console.log("Callback: " +  req.user)
        req.session.user = req.user
        console.log(req.session)
        res.redirect('/')
    }
)

export default router