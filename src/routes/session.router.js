import { Router } from 'express'
import passport from 'passport'

import { authToken } from '../utils.js'
import config from '../config/config.js'

const router = Router()

router.post('/login', 
    passport.authenticate('login', '/login'),
    async(req, res)=>{
    try {
        if(!req.user){
            return res.status(400).send('Invalid Credentials')
        }else{
            return res.cookie(config.SECRET_JWT, req.user.token).redirect('/products')

            //return res.redirect('/products')
        }

    } catch (error) {
        return console.error(error)
    }

})

router.post('/register', 
    passport.authenticate('register', '/register'),
    async(req, res)=>{
    try {
        return res.redirect('/')
        
    } catch (error) {
        return console.error(error)
    }
})


router.get('/logout', async(req, res)=>{
    try{
        if(req.cookies){
            res.clearCookie(config.SECRET_JWT)
            req.session.destroy()
            console.log("cookie cleared")
            // res.end()
            return res.redirect('/')
        }else{
            console.log("No cookies")
            return res.redirect('/')
        }
        // if(req.session?.user){
        //     req.session.destroy()
        //     console.log("error?")
        //     return res.redirect('/')
        // }else{
        //     return res.redirect('/')
        // }
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
        // req.session.user = req.user
        return res.cookie(config.SECRET_JWT, req.user.token).redirect('/products')
        // console.log(req.user)
    }
)

router.get('/current', authToken,(req, res)=>{
    try {
        const user = {
            first_name: req.user.first_name,
            last_name: req.user?.last_name,
            age: req.user?.age,
            email: req.user.email,
            rol: req.user.rol
        }
        return res.json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Server error"})
    }

    // let authHeader = req.cookies

    // console.log(authHeader)
    // if(!authHeader){
        // return res.send({status: 'error', cookiePayload: 'Cookie not found', userPayload: req.user})
    // }
    // return res.send({status: "success", cookiePayload: authHeader, userPayload: req.user})
    // return res.json(req.user)
})
export default router