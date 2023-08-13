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


const app = express()

const URL =  "mongodb+srv://diegotomasaguero4123:mQxefoYlVTbSvdgu@cluster1.pfn01oe.mongodb.net/?retryWrites=true&w=majority"
const dbName = 'ecommerce'

app.use(express.json())
app.use(express.urlencoded({ extended: true }));    

app.use(session({
    store: MongoStore.create({
        mongoUrl: URL,
        dbName: dbName,
        mongoOptions:{
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        ttl: 100
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

const httpServer = app.listen(8080, ()=>{ console.log("listening") })
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
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

mongoose.connect(URL, {
    dbName: 'ecommerce'
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



