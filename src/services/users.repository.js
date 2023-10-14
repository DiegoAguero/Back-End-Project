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

    async getUserById(id, populate = false){
        return await this.dao.getUserById(id, populate)
    }
    async getUserByEmail(id, populate = false){
        return await this.dao.getUserByEmail(id, populate)
    }
    async updateUser(user){
        const userToInsert = new UserDTO(user)
        console.log(userToInsert)
        return await this.dao.updateUser(userToInsert)
    }
}   