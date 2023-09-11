import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import ProductManager from './dao/ProductManager.js'
import productsRoute from './routes/product.router.js'
import cartRoute from './routes/cart.router.js'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import mongoose from 'mongoose'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import initializePassport from './config/passport.config.js'
import msgModel from './dao/models/messages.model.js'
import __dirname from './utils.js'
import viewsRoute from './routes/views.router.js'
import sessionRoute from './routes/session.router.js'
import userModel from './dao/models/user.model.js'

//.env config
import config from './config/config.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));    
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.MONGO_URI,
        dbName: config.DB_NAME,
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

const httpServer = app.listen(config.PORT, ()=>{ console.log("listening") })
const io = new Server(httpServer)


app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')



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

//Test de destruccion prematura de sesion
app.get('*', (req, res, next) => {

    req.session.touch()
    console.log(req.session)
    next()
    
})
app.use((req, res, next) => {

    console.log((req.session))
    next()
    
})
//corremos el server de mongoose
mongoose.set('strictQuery', false)

mongoose.connect(config.MONGO_URI, {
    dbName: config.DB_NAME
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



