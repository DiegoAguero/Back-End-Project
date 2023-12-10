import express from 'express'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'
import cors from 'cors'

import cartRoute from './routes/cart.router.js'
import productsRoute from './routes/product.router.js'
import initializePassport from './config/passport.config.js'
import msgModel from './dao/mongo/models/messages.model.js'
import __dirname from './utils.js'
import viewsRoute from './routes/views.router.js'
import sessionRoute from './routes/session.router.js'
import ticketRoute from './routes/ticket.router.js'
import userRoute from './routes/user.router.js'
import paymentRoute from './routes/payment.router.js'
import { productService } from './services/index.js'
import { logger } from './services/logger/logger.js'
//.env config
import config from './config/config.js'
import { addLogger } from './services/logger/logger.js'

const app = express()
app.use('/static', express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}))
//passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const httpServer = app.listen(config.PORT, ()=>{ logger.info('Listening...') })
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

const swaggerOptions = {
    definition:{
        openapi: '3.0.1',
        info: {
            title: 'Ecommerce Project',
            description: 'This project has been created for the Back-End course from Coder House'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)
app.use('/api/docs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))
app.use(addLogger)
//Logger test
app.get('/loggerTest', (req, res) => {
    req.logger.fatal('fatal test')
    req.logger.error('error test')
    req.logger.warning('warning test')
    req.logger.info('info test')
    req.logger.debug('debug test')
    res.send('logger testing')
})
app.use('/api/products', productsRoute)
app.use('/api/carts', cartRoute)
app.use('/api/session', sessionRoute)
app.use('/api/ticket', ticketRoute)
app.use('/api/user', userRoute)
app.use('/api/payment', paymentRoute)
app.use('/', viewsRoute)

const messages = []
io.on('connection', socket=>{
    logger.info("New connection!")
    socket.on('newProduct', async data =>{
        try{
            const {title, description, price, thumbnail, code, stock} = await data
            const product = {title, description, price, thumbnail, code, stock}
            const prodCreated = await productService.addProductToDatabase(product)
            const getProds = await productService.getProducts()
            socket.emit('reload', getProds)
        }catch(e){
            return console.error(e)
        }
    })
    socket.on('newPremiumProducts', async owner =>{
        try{
            const getAllProducts = await productService.getProducts()
            const filterByOwner = getAllProducts.filter(prod => prod.owner === owner)
            socket.emit('reloadPremiumProducts', filterByOwner)
        }catch(e){
            return console.error(e)
        }
    })
    socket.on('newUser',  user=>{
        logger.info(`${user} se conectó`)
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



