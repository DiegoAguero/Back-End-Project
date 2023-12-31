import { logger } from "../services/logger/logger.js"
import { userService } from "../services/index.js"
import config from "../config/config.js"
export const login = async (req, res)=>{
    try {
        if(!req.user){
            return res.status(400).send('Invalid Credentials')
        }else{
            return res.cookie(config.SECRET_JWT, req.user.token).redirect('/products')
        }

    } catch (error) {
        return console.error(error)
    }
}

export const register = async (req, res)=>{
    return res.redirect('/')
}

export const logout = async (req, res)=>{
    try{        
        if(req.cookies){
            const user = req.user
            if(user){
                user.last_connection = new Date()
                await userService.updateUser(user._id, user)
            }
            res.clearCookie(config.SECRET_JWT)
            req.session.destroy()
            logger.info("cookie cleared")
            return res.redirect('/')
        }else{
            logger.info("No cookies")
            return res.redirect('/')
        }       
    }catch(e){
        return console.error(e)
    }
}

export const githubLogin = async (req, res)=>{
    return res.cookie(config.SECRET_JWT, req.user.token).redirect('/products')
}

export const current = async (req, res)=>{
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
}