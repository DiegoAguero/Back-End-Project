import UserDTO from '../DTO/users.dto.js'
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
    async updateUser(userId, user){
        const userToInsert = new UserDTO(user)
        return await this.dao.updateUser(userId, userToInsert)
    }
    async uploadDocuments(userId, files){
        const user = await this.dao.getUserById(userId)
        const profileFiles = files?.profile
        const productsFiles = files?.products
        const documentsFiles = files?.documents
        productsFiles?.forEach(products=> user.documents.push({name: products.filename, reference: products.path}))
        profileFiles?.forEach(p => user.documents.push({name: p.filename, reference: p.path}))
        documentsFiles?.forEach(d => user.documents.push({name: d.filename, reference: d.path}))
        const updateUser = await this.dao.updateUser(user.id, user)
        return updateUser

    }
}   