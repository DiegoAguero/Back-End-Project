import chai from 'chai'
import supertest from 'supertest'
import { logger } from '../services/logger/logger.js'

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

describe('Testing /api/products', ()=>{
    describe('Get products test', ()=>{
        it('On the endpoint /api/products must return a list of the products added to the database', async()=>{
            const response = await requester.get('/api/products')
            const {status, ok, body} = response
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
            expect(body.payload).to.be.an('array')
        })
    })
    //Con esto obtengo el producto creado abajo, y lo elimino en el otro test
    let prodCreated;
    describe('Create a product test', ()=>{
        it('On the endpoint POST /api/products must create a product', async()=>{
            const productMock = {
                title: 'Product',
                description: 'Product description',
                price: 20,
                thumbnail: 'url',
                code: 'Product23',
                stock: 2,
                status: true
            }
            prodCreated = await requester.post('/api/products').send(productMock)
            const {status, ok, body} = prodCreated
            expect(status).to.be.eq(200)
            expect(body.payload).to.have.property('_id')
            expect(ok).to.be.ok
        })
    })
    describe('Get a product by ID test', ()=>{
        it('On the endpoint GET /api/products/:pId must obtain a product', async()=>{
            const result = await requester.get('/api/products/64c68aaf456f4b4675841914')
            const {status, ok, body} = result
            expect(status).to.be.eq(200)
            expect(body.payload).to.have.property('_id')
            expect(ok).to.be.ok
        })
    })
    describe('Update a product by ID test', ()=>{
        it('On the endpoint PUT /api/products/:pId must', async()=>{
            const prodMock = {
                title: 'New Product',
                description: 'New Product description',
                price: 20,
                thumbnail: 'url',
                code: 'product223',
                stock: 2,
                status: true
            }
            const result = await requester.put(`/api/products/${prodCreated.body.payload._id}`).send(prodMock)
            const {status, ok, body} = result
            console.log(body.payload)
            expect(body.payload).to.have.property('modifiedCount').to.be.eq(1)
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
        })
    })
    describe('Delete a product by ID test', ()=>{
        it('On the endpoint DELETE /api/products/delete/:pId must delete the product', async()=>{
            const result = await requester.delete(`/api/products/delete/${prodCreated.body.payload._id}`)
            const {status, ok, body} = result
            expect(body.payload).to.have.property('deletedCount').to.be.eq(1)
            expect(status).to.be.eq(200)
            expect(ok).to.be.ok
        })
    })  
})