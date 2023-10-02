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
        const userToCreate = new UserDTO(user)
        return await this.dao.createUser(userToCreate)
    }
    async getUserByEmail(email, populate = false){
        return await this.dao.getUserByEmail(email, populate)
    }
    async getUserById(id){
        return await this.dao.getUserById(id)
    }
}   