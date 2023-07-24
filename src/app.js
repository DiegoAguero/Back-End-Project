import express from 'express'
import ProductManager from './ProductManager.js'
import productsRoute from './routes/product.router.js'
import cartRoute from './routes/cart.router.js'
import viewsRoute from './routes/views.router.js'
import handlebars from 'express-handlebars'
import {Server} from 'socket.io'
import __dirname from './utils.js'
import mongoose from 'mongoose'


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));    

const httpServer = app.listen(8080, ()=>{ console.log("listening") })
const io = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use('/static', express.static(__dirname + '/public'))

//Por alguna razón cuando pongo la carpeta afuera del src y escribo el path no reconoce la carpeta, pero en la terminal
//me aparece la ruta bien y me lleva al archivo cuando lo clickeo, la verdad no sé por qué, tuve que hacer
//nodemon --ignore .\src\product\products.json para que no se cree el bucle infinito y despues .\src\app.js para iniciarlo
//todo en la misma linea
// --> nodemon --ignore .\src\product\products.json .\src\app.js

//Arreglar bucle infinito o preguntarle al profesor!
//Fix 2

const prod = new ProductManager(__dirname + '/../product/products.json') 
prod.addProduct('Agua', 'Hola agua', 20, 'url', '12b', 20)
prod.addProduct('Sprite', 'Hola sprite', 50, 'url', '1234b', 30)
prod.addProduct('Coca Cola', 'Hola Coca Cola', 30, 'url', '124b', 10)
prod.addProduct('Mirinda', 'Hola Mirinda', 50, 'url', '14b', 25)
prod.addProduct('7up', 'Hola 7up', 10, 'url', '123b', 35)
prod.addProduct('Pepito', 'Hola Pepito', 15, 'url', '12pb', 30)
prod.addProduct('Oreo', 'Hola Oreo', 20, 'url', '1b2d', 50)
prod.addProduct('Toddy', 'Hola Toddy', 20, 'url', '123cb', 35)
prod.addProduct('Frutigran', 'Hola Frutigran', 15, 'url', '12cd', 35)
prod.addProduct('Rumba', 'Hola Rumba', 20, 'url', '132b', 50)

export default prod
app.use('/api/products', productsRoute)
app.use('/api/carts', cartRoute)
app.use('/', viewsRoute)


//corremos el server de mongoose
const URL =  "mongodb+srv://diegotomasaguero4123:mQxefoYlVTbSvdgu@cluster1.pfn01oe.mongodb.net/?retryWrites=true&w=majority"
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

io.on('connection', socket=>{
    console.log("New connection !")
    socket.on('newProduct', async data =>{
        const {title, description, price, stock, thumbnail, code, status} = data
        console.log(title, description, price, stock, thumbnail, code, status)
        prod.addProduct(title, description, price, stock, thumbnail, code, status)
        const getProds = prod.getProducts()
        io.emit('reload', getProds)
    })

})



