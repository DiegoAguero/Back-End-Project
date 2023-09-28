import UserDTO from '../dao/DTO/users.dto.js'
import {createHash} from '../utils.js'
import CartManager from '../dao/file/carts.file.js'
export default class UserRepository{
    constructor(dao){
        this.dao = dao
        this.cartManager = new CartManager()
    }
    async getAllUsers(populate = false){
        return await this.dao.getAllUsers(populate)
    }
    async createUser(user){
        user.password = createHash(user.password)
        const userCart = await this.cartManager.createCart([]) 
        user.cart = userCart._id
        const userToCreate = new UserDTO(user)
        return await this.dao.createUser(userToCreate)
    }
    async getUserByEmail(email){
        return await this.dao.getUserByEmail(email)
    }
}   