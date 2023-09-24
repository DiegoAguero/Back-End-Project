import config from '../config/config.js'
import mongoose from 'mongoose'


export let User
export let Cart
export let Product
export let Ticket
console.log(`Persistency with ${config.PERSISTENCY}`)

switch (config.PERSISTENCY) {
    case 'MONGO':
        mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            UseUnifiedTopology: true,
            dbName: config.DB_NAME 
        })
            .then(r=>{
                console.log("Mongo connected") 
            })
            .catch(error =>{
                console.error(error)
            })
        const {default: UserMongo} = await import('./mongo/users.mongo.js')
        const {default: CartMongo} = await import('./mongo/carts.mongo.js') 
        const {default: ProductMongo} = await import('./mongo/products.mongo.js') 
        const {default: TicketMongo} = await import('./mongo/tickets.mongo.js') 
        User = UserMongo
        Cart = CartMongo
        Product = ProductMongo
        Ticket = TicketMongo
        break;
    case 'FILE':
        const {default: ProductFile} = await import('./file/products.file.js')
        const {default: CartFile} = await import('./file/carts.file.js')
        const {default: TicketFile} = await import('./file/tickets.file.js')
        const {default: UserFile} = await import('./file/users.file.js')
        Cart = CartFile
        Product = ProductFile
        User = UserFile
        Ticket = TicketFile
        break;
    default:
        break;
}

//Persistency architecture