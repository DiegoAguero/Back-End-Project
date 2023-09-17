import { Cart, Product } from '../dao/factory.js'
import CartManager from '../dao/mongo/carts.mongo.js'

import CartRepository from './carts.repository.js'
import ProductsRepository from './products.repository.js'
// import OrderRepository from './orders.repository.js'
// import StoreRepository from './stores.repository.js'

export const cartService = new CartRepository(new Cart())
export const productService = new ProductsRepository(new Product())
// export const storeService = new StCartepository(new Store())
// export const orderService = new OrderRepository(new Order())