import { userService } from "../services/index.js";

export const createUser = async (req, res)=>{
    try {
        const user = req.body
        const userCreated = await userService.createUser(user)
        if(!userCreated) return res.send({status: 'error', payload: 'Unable to create the user!'})
        return res.send({status: 'success', payload: user})
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserByEmail = async (req, res)=>{
    try {
        const email = req.body.email
        const getUser = await userService.getUserByEmail(email)
        if(!getUser) return res.send({status: 'error', payload: 'Unable to find the user!'})
        return res.send({status: 'success', payload: getUser})
    } catch (error) {
        throw new Error(error)
    }
}