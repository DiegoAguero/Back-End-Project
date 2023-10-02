import userModel from "./models/user.model.js";
export default class UserManager{

    async createUser(user){
        const userCreated = await userModel.create(user)
        if(!userCreated) throw new Error('Unable to create the user!')
        return userCreated
    }
    
    async getUserByEmail(email, populate = false){
        if(populate){
            const findUser = await userModel.findOne({email: email}).populate('cart').lean().exec()
            return findUser
        }
        const findUser = await userModel.findOne({email: email})
        // if(!findUser) throw new Error('Unable to find the user!')
        return findUser
    }

    async getUserById(id){
        return await userModel.findById(id)
    }



}