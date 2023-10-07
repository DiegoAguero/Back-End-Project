import CustomError from "../../services/errors/customErrors.js";
import EErrors from "../../services/errors/enums.js";
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
    
    async getUserByEmail(email, populate = false){
        try {
            if(populate){
                const findUser = await userModel.findOne({email: email}).populate('cart').lean().exec()
                return findUser
            }
            const findUser = await userModel.findOne({email: email})
            // if(!findUser) throw new Error('Unable to find the user!')
            return findUser
        } catch (error) {
            CustomError.createError({
                name: "Get user by email error",
                cause: error,
                message: "Error trying to get the user",
                code: EErrors.DATABASES_ERROR
            })
        }

    }

    async getUserById(id){
        try {
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



}