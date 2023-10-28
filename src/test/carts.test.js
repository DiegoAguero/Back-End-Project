import chai from 'chai'
import supertest from 'supertest'
import { logger } from '../services/logger/logger.js'

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

describe('Testing Cart Router', ()=>{
    describe('Create cart test', ()=>{
        it('On endpoint POST /api/carts/ must return a new cart', async()=>{
            const result = await requester.post('/api/carts')
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            expect(body.payload).to.have.property('_id')
            expect(body.payload).to.have.property('products')   
        })
    })
    describe('Get all carts test', ()=>{
        it('On endpoint GET /api/carts/ must return all the carts created', async()=>{
            const result = await requester.get('/api/carts')
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            expect(body.payload).to.be.an('array')
        })
    })
    describe('Get a cart by ID test', ()=>{
        it('On endpoint GET /api/carts/:cId must return a specific cart', async()=>{
            const result = await requester.get('/api/carts/64da6c63d74f6291115e7aa3')
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            expect(body.payload).to.have.property('_id')
        })
    })
    describe('Add a product to the cart test', ()=>{
        it('On endpoint POST /api/carts/:cId/products/:pId must add a product to the cart', async()=>{
            const result = await requester.post('/api/carts/64da6c63d74f6291115e7aa3/product/64c68a91456f4b467584190f')
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            expect(body.payload).to.have.property('products')
            expect(body.payload).to.have.property('_id')
        })
    })
    describe('Delete a product from the cart test', ()=>{
        it('On endpoint DELETE /api/carts/:cId/product/:pId/delete must delete the product from the cart', async()=>{
            const result = await requester.delete('/api/carts/64da6c63d74f6291115e7aa3/product/64c68a91456f4b467584190f/delete')
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            expect(body.payload).to.have.property('products')
            expect(body.payload).to.have.property('_id')
        })
    })
    describe('Clear the cart test', ()=>{
        it('On endpoint post /api/carts/:cId/', async()=>{
            const result = await requester.post('/api/carts/64da6c63d74f6291115e7aa3')
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            console.log(body.payload)
            expect(body.payload).to.have.property('products').to.be.eq('[]')
        })
    })
    describe('Purchase the products tests', ()=>{
        it('On endpoints post /api/carts/:cId/purchase', async()=>{
            const mockPurchase = {
                purchaser: 'diegoeselmejor222@gmail.com'
            }
            const result = await requester.post('/api/carts/64da6c63d74f6291115e7aa3').send(mockPurchase)
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            expect(body.payload).to.have.property('_id')
        })
    })

})