import chai from 'chai'
import supertest from 'supertest'
import {faker} from  '@faker-js/faker'

const expect = chai.expect
const requester = supertest('http://127.0.0.1:8080')

describe('Testing register, login and current', ()=>{
    let cookie;
    const mockUser = {
        first_name: 'Diego',
        last_name: 'Aguero',
        email: faker.internet.email(),
        age: 20,
        rol: 'user',
        password: 'secret'
    }

    it('On the endpoint POST /api/session/register must register an user', async()=>{
        const result = await requester.post('/api/session/register').send(mockUser)
        const {status, ok, body} = result
        expect(status).to.be.eq(302)
        expect(body).to.be.ok
    })

    it('On the endpoint POST /api/session/login must login an user', async()=>{
        const result = await requester.post('/api/session/login').send({
            email: mockUser.email,
            password: mockUser.password
        })
        const cookieResult = result.headers['set-cookie'][0]
        cookie = {
            name: cookieResult.split('=')[0],
            value: cookieResult.split('=')[1].split(';')[0]
        }
        expect(cookie.name).to.be.ok.and.equal('secretForJWT')
        expect(cookie.value).to.be.ok
    })

    it('On the endpoint GET /api/session/current must send the cookie to see the content of the user', async()=>{
        const {body, ok, status} = await requester.get('/api/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
        expect(status).to.be.eq(200)
        expect(ok).to.be.ok
        expect(body.payload.email).to.be.eq(mockUser.email)
    })
})