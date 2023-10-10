import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import {logger} from '../services/logger/logger.js'
import { generateUserErrorInfo } from "../services/errors/info.js";
import { userService } from "../services/index.js";

export const getAllUsers = async (req, res)=>{
    try {
        let populate = req.query?.populate || false
        populate = populate === "false" ? false : true
        return await userService.getAllUsers(populate)

    } catch (error) {
        return console.error(error)
    }
}

export const createUser = async (req, res)=>{
    try {
        const user = req.body
        if(!user.first_name || !user.email){
            return CustomError.createError({
                name: "User creation error",
                cause: generateUserErrorInfo(user),
                message: "Error trying to create the user",
                code: EErrors.INVALID_TYPE_ERROR
            })
        } 
        const userCreated = await userService.createUser(user)
        if(!userCreated) return res.send({status: 'error', payload: 'Unable to create the user!'})
        return res.send({status: 'success', payload: user})
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserById = async(req, res)=>{
    const userId = req.params.uid
    try {
        const getUser = await userService.getUserById(userId, true)
        return res.send({status:'success', payload: getUser})
    } catch (error) {
        console.log(error)
        CustomError.createError({
            name: "Get user error",
            cause: generateUserErrorInfo(userId),
            message: "User not found",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
}
export const getUserByEmail = async (req, res)=>{
    const email = req.params.email
    try {
        const getUser = await userService.getUserByEmail(email, true)
        return res.send({status:'success', payload: getUser})
    } catch (error) {
        CustomError.createError({
            name: "Get user error",
            cause: generateUserErrorInfo(email),
            message: "User not found",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
}
export const changeUserRol = async (req, res)=>{
    const userId = req.params.uid
    try {
        let getUser = await userService.getUserById(userId)
        if(getUser.rol === "user"){ getUser.rol = "premium" }
        else{ getUser.rol = "user" }

        const saveUser = await userService.updateUser(getUser)
        logger.info(saveUser)
        return res.send({status: 'success', payload: saveUser})

    } catch (error) {
        CustomError.createError({
            name: "Change role error",
            cause: generateUserErrorInfo(userId),
            message: error,
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
}

export const resetPassword = async (req, res)=>{
    //ver nodemailer, video del profesor
    //Reset password
}


