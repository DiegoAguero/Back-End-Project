import FileManager from './FileManager.js'
import CartManager from './carts.file.js'
export default class UserManager extends FileManager{
    constructor(path = './db/users.db.js'){
        super(path)
        this.cartManager = new CartManager()
    }
    async getAllUsers(populate = false){
        const users = await this.get()
        if(populate){
            const carts = await this.cartManager.getAllCarts()
            for (let i = 0; i < users.length; i++) {
                const result = []
                const userCartArray = []
                const usersCart = users[i].cart
                userCartArray.push(usersCart)
                userCartArray.forEach(cId => {
                    let cart = carts.find(cart => parseInt(cart._id) === parseInt(cId)) 
                    result.push(cart)
                })
                users[i].cart = result
            }
        }
        return users
    }
    async createUser(user){
        return await this.add(user)
    }

    async getUserByEmail(email){
        const user = await this.getAllUsers()
        const userEmail = user.find(user => user.email === email)
        return userEmail
    }

}