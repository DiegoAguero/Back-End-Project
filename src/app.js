import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import ProductManager from './dao/ProductManager.js'
import productsRoute from './routes/product.router.js'
import cartRoute from './routes/cart.router.js'
import sessionRoute from './routes/session.router.js'
import viewsRoute from './routes/views.router.js'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'
import msgModel from './dao/models/messages.model.js'
import initializePassport from './config/passport.config.js'
import passport from 'passport'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express()

//.env config
dotenv.config({path: '.env'})
const URI = process.env.MONGO_URI
const PORT = parseInt(process.env.PORT)
const DB_NAME = process.env.DB_NAME

// console.log(URI, PORT)


app.use(express.json())
app.use(express.urlencoded({ extended: true }));    
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: URI,
        dbName: DB_NAME,
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 10000
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge: 60000
    },
    logging: true
}))

const httpServer = app.listen(PORT, ()=>{ console.log("listening") })
const io = new Server(httpServer)



// create({
//     default: 'main',
//     layoutsDir: path.join(__dirname, 'views/layouts/main'),
//     partialsDir: path.join(__dirname, 'views'),

//     helpers: {
//         compare: function(value1, value2){
//             return value1 === value2
//         }
//     }
// })

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

const handleBars = handlebars.create({})
handleBars.handlebars.registerHelper('compare', function (a, b){
    return a == b
})

app.use('/static', express.static(__dirname + '/public'))

const prod = new ProductManager()
export default prod

//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/products', productsRoute)
app.use('/api/carts', cartRoute)
app.use('/api/session', sessionRoute)

app.use('/', viewsRoute)


//corremos el server de mongoose
mongoose.set('strictQuery', false)

mongoose.connect(URI, {
    dbName: DB_NAME
})
    .then(() =>{
        
        console.log('DB Connected with mongoose')
        httpServer.on('error', e=> console.error(e))
    })
    .catch(e =>{
        console.log("ERROR: Cant connect to the DB")
    })


const messages = []
io.on('connection', socket=>{
    console.log("New connection!")
    socket.on('newProduct', async data =>{
        try{
            const  {title, description, price, thumbnail, code, stock} = await data
            const prodCreated = await prod.addProduct(title, description, price, thumbnail, code, stock)
            const getProds = await prod.getProducts()
            socket.emit('reload', getProds)
        }catch(e){
            return console.error(e)
        }
    })

    socket.on('newUser',  user=>{
        console.log(`${user} se conectó`)
        socket.on('message', async data=>{
            try{
                messages.push(data)
                const log = await msgModel.create(data) 
                io.emit('logs', messages)
            }catch(e){
                return console.error(e)
            }
        })
    })


})



