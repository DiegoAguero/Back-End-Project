import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import passport from 'passport'
import { authToken, extractCookie } from '../utils.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

const router = Router()

dotenv.config({path: '.env'})
const SECRET_JWT = process.env.SECRET_JWT

router.post('/login', 
    passport.authenticate('login', '/login'),
    async(req, res)=>{
    try {
        if(!req.user){
            return res.status(400).send('Invalid Credentials')
        }else{
            // req.session.user = req.user
            console.log("error aca")
            
            return res.cookie(SECRET_JWT, req.user.token).redirect('/products')

            //return res.redirect('/products')
        }

    } catch (error) {
        return console.error(error)
    }

})

router.post('/register', 
    passport.authenticate('register', {failureRedirect: '/register'}),
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
            res.clearCookie(SECRET_JWT)
            console.log("cookie cleared")
            // res.end()
            return res.redirect('/')
        }else{
            console.log("Cookie not cleared")
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
        console.log("Callback: " +  req.user)
        // req.session.user = req.user
        return res.cookie(SECRET_JWT, req.user.token).redirect('/products')
        // console.log(req.user)
    }
)

router.get('/current',(req, res)=>{
    try {
        const token = extractCookie(req)
        if(!token)return res.status(401).json({error: "Not authenticated"})
    
        jwt.verify(token, SECRET_JWT, (error, credentials)=>{
            if(error) return res.status(403).json({error: "Not authorized"})
            return res.json(credentials.user)
        })
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