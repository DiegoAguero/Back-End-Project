import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
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

export const getUserByEmail = async (req, res)=>{
    try {
        // const email = req.body.email
        const email = req.params.email
        const getUser = await userService.getUserByEmail(email)
        if(!getUser) {
            CustomError.createError({
                name: "Get user error",
                cause: generateUserErrorInfo(email),
                message: "User not found",
                code: EErrors.NOT_FOUND_ERROR
            })
        }
        return res.send({status: 'success', payload: getUser})
    } catch (error) {
        throw new Error(error)
    }
}