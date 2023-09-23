import userModel from "./models/user.model.js";
export default class UserManager{

    async createUser(user){
        const userCreated = await userModel.create(user)
        if(!userCreated) throw new Error('Unable to create the user!')
        return userCreated
    }
    
    async getUserByEmail(email){
        const findUser = await userModel.findOne({email: email})
        if(!findUser) throw new Error('Unable to find the user!')
        return findUser
    }



}