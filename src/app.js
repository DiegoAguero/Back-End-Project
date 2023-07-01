import express from 'express'
import ProductManager from './ProductManager.js'
import productsRoute from './routes/product.router.js'
import cartRoute from './routes/cart.router.js'
const app = express()
app.use(express.json())
const prod = new ProductManager('../product/products.json') 
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

// let allProducts = prod.getProducts()
export default prod
app.get('/products', (req, res)=>{
    // try {
    //     const products = prod.getProducts();
    //     const limit = req.query.limit;
    //     if (limit === undefined) return res.send(products);
    //     return res.send(products.slice(0, limit));
    // } catch (err) {
    //     throw new Error(err);
    // }

})
app.use('/api/products', productsRoute)
app.use('/api/carts', cartRoute)

// app.get('/products/:pId', (req, res)=>{
//     const id = req.params.pId
//     const encontrado = prod.getProductById(id)
//     if(encontrado === undefined) return res.send('Producto no encontrado')
//     return res.send(encontrado)
// })


app.listen(8080)
