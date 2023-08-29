import {fileURLToPath} from 'url'
import {dirname} from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SECRET_JWT = process.env.SECRET_JWT
const SECRET_COOKIE_JWT = process.env.SECRET_COOKIE_JWT

export default __dirname

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}
export const isValidPassword = (user, password)=>{
    return bcrypt.compareSync(password, user.password) //solo devuelve true o false
}

export const generateToken = user =>{
    return jwt.sign({ user }, SECRET_JWT, {expiresIn: '24h'})
}

export const authToken = (req, res, next) =>{
    let authHeader = req.headers.auth

    if(!authHeader){
        authHeader = req.cookies[SECRET_JWT]
        if(!authHeader){
            return res.status(401).send({error: 'Not authenticated'})
        }
    }
    const token = authHeader
    jwt.verify(token, SECRET_JWT, (error, credentials) =>{
        if(error) return res.status(403).send({error: 'Not authorized'})
        
        console.log(credentials.user)
        req.user = credentials.user
        next()
    })
}


export const extractCookie = req =>{
    console.log("Requested cookie: " + req + "Req all the cookies: " + req.cookies)
    return (req && req.cookies) ? req.cookies[SECRET_JWT] : null
}

export const authorization = rol =>{
    return async(req, res, next)=>{
        const user = req.user
        if(!user) return res.status(401).send({error: 'Unauthorized'})
        if(user.user.rol !== rol) return res.status(403).send({error: 'Not enough permissions'})
        return next()
    }
}

