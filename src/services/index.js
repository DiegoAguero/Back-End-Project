import { Cart, Product, User, Ticket } from '../dao/factory.js'

import CartRepository from './carts.repository.js'
import ProductsRepository from './products.repository.js'
import UserRepository from './users.repository.js'
import TicketRepository from './tickets.repository.js'
// import StoreRepository from './stores.repository.js'

export const cartService = new CartRepository(new Cart())
export const productService = new ProductsRepository(new Product())
export const userService = new UserRepository(new User())
export const ticketService = new TicketRepository(new Ticket())
// export const storeService = new StCartepository(new Store())
// export const orderService = new OrderRepository(new Order())