import UserDTO from '../DTO/users.dto.js'
import {createHash} from '../utils.js'
import { logger } from './logger/logger.js'
export default class UserRepository{
    constructor(dao){
        this.dao = dao
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
    async getUserByEmail(email, populate = false){
        return await this.dao.getUserByEmail(email, populate)
    }
    async deleteUser(id){
        return await this.dao.deleteUser(id)
    }
    async updateUser(userId, user){
        const userToInsert = new UserDTO(user)
        return await this.dao.updateUser(userId, userToInsert)
    }

}   