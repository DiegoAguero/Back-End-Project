import config from '../config/config.js'
import mongoose from 'mongoose'


export let User
export let Cart
export let Product

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
        break;

    default:
        break;
}

//Persistency architecture