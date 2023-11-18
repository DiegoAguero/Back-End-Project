import { Router } from 'express'
import passport from 'passport'

import { authToken } from '../utils.js'
import config from '../config/config.js'
import {logger} from '../services/logger/logger.js'	
import { userService } from '../services/index.js'
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
            const user = req.user
            user.last_connection = new Date()
            await userService.updateUser(user._id, user)
            res.clearCookie(config.SECRET_JWT)
            req.session.destroy()
            logger.info("cookie cleared")
            // res.end()
            return res.redirect('/')
        }else{
            logger.info("No cookies")
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
        return res.send({status: 'success', payload: user})

    } catch (error) {
        return res.status(500).json({error: "Server error"})
    }

})
export default router