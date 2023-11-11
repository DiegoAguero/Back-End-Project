import CustomError from "../../services/errors/customErrors.js";
import EErrors from "../../services/errors/enums.js";
import { generateUserErrorInfo } from "../../services/errors/info.js";
import userModel from "./models/user.model.js";
export default class UserManager{

    async createUser(user){
        try {
            const userCreated = await userModel.create(user)
            if(!userCreated) throw new Error('Unable to create the user!')
            return userCreated
        } catch (error) {
            CustomError.createError({
                name: "Create user error",
                cause: error,
                message: "Error trying to create the user",
                code: EErrors.DATABASES_ERROR
            })
        }

    }
    
    async getUserById(id, populate = false){
        try {
            if(populate) return await userModel.findById(id).populate('cart').lean().exec()
            return await userModel.findById(id)
        } catch (error) {
            CustomError.createError({
                name: "Get user by id error",
                cause: error,
                message: "Error trying to get the user",
                code: EErrors.DATABASES_ERROR
            })
        }
    }
    async getUserByEmail(email, populate = false){
        try {
            if(populate) return await userModel.findOne({email: email}).populate('cart').lean().exec()
            return await userModel.findOne({email: email})
        } catch (error) {
            CustomError.createError({
                name: "Get user by email error",
                cause: error,
                message: "Error trying to get the user",
                code: EErrors.DATABASES_ERROR
            })
        }
    }
    async updateUser(userId, user){
        try {
            return await userModel.findByIdAndUpdate({_id: userId}, user)
        } catch (error) {
            CustomError.createError({
                name: "Update user error",
                cause: generateUserErrorInfo(userUpdated),
                message: "Error trying to update the user",
                code: EErrors.DATABASES_ERROR
            })
        }
    }



}