import UserDTO from '../dao/DTO/users.dto.js'
import {createHash} from '../utils.js'
export default class UserRepository{
    constructor(dao){
        this.dao = dao
    }
    async createUser(user){
        user.password = createHash(user.password)
        
        const userToCreate = new UserDTO(user)
        return await this.dao.createUser(userToCreate)
    }
    async getUserByEmail(email){
        return await this.dao.getUserByEmail(email)
    }
}   