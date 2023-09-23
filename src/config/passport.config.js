import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import passportJWT from 'passport-jwt'

import userModel from '../dao/mongo/models/user.model.js'
import CartManager from '../dao/mongo/CartManager.js'
//.env config
import config from './config.js'
import { createHash, isValidPassword, extractCookie, generateToken } from '../utils.js'

const LocalStrategy = local.Strategy
const JWTStrategy = passportJWT.Strategy
const JWTExtract = passportJWT.ExtractJwt

const cartManager = new CartManager()



// App ID: 375167
// Client ID: Iv1.bde27374545eed48
// Secret: 458779cf168171d5fc50e7d98d644bb0e5238da5

function initializePassport(){

    passport.use('github', new GitHubStrategy(
        {
            clientID: config.CLIENT_ID_GITHUB,
            clientSecret: config.CLIENT_SECRET_GITHUB,   
            callbackURL: config.CALLBACK_URL_GITHUB,
        },
        async (accessToken, refreshToken, profile, done)=>{


            try{
                const user = await userModel.findOne({email: profile._json.email})
                if(user){
                    console.log("User already exists " + profile._json.email)
                }else{
                    const newCartForUser = await cartManager.createCart()
                    const newUser = {
                        first_name: profile._json.name,
                        email: profile._json.email,
                        cart: newCartForUser._id,
                        password: ''
                    }
                    const result = await userModel.create(newUser)
                    console.log(result)
                }

                //Creamos la token para el usuario
                const token = generateToken(user)
                user.token = token
                // console.log(token)
                // console.log(user)
                return done(null, user)
            }catch(e){
                return done("Error to log-in with Github. " + e)
            }
        }
    ))
    
    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: JWTExtract.fromExtractors([extractCookie]),
            secretOrKey: config.SECRET_JWT
        },
        (jwt_payload, done) => {
            console.log({jwt_payload})
            return done(null, jwt_payload)
        }
    ))

    //Esto funciona como un middleware
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        }, 
        async(req, username, password, done)=>{
            const {first_name, last_name, age, rol, email} = req.body
            try{
                const user = await userModel.findOne({email: username})
                if(user){
                    console.log("User already exist")
                    return done(null, false)
                }
                const newCartForUser = await cartManager.createCart()
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    rol,
                    email,
                    cart: newCartForUser._id,
                    password: createHash(password)
                }
                const result = await userModel.create(newUser)
                return done(null, result)
            }catch(e){
                return done('Error to register' + e)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email'}, 
        async(username, password, done)=>{
            try {
                if(username == 'adminCoder@coder.com' && password == 'adminCod3r123'){
                    var mongoObjectId = function () {
                        var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
                        return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
                            return (Math.random() * 16 | 0).toString(16);
                        }).toLowerCase().lean().exec();
                    };
                    //Tuve que poner esta funcion para que me genere un string igual a una de mongo
                    //De otra manera me tiraba un error gigantezco
                    //Para ver el error solo consta con borrar el _id del user
                    //_id: mongoObjectId, 
                    //Creamos la token para el usuario
                    const user = {_id: mongoObjectId, email: username, password, rol: 'admin'}
                    const token = generateToken(user)
                    user.token = token
                    return done(null, user)

                }
                const user = await userModel.findOne({email: username}).populate('cart').lean().exec()
                if(!user){
                    console.error('User doesnt exist')
                    return done(null, false)
                }
                if(!isValidPassword(user, password)){
                    console.error('Password is not valid')
                    return done(null, false)
                }
                if(!user.cart){
                    const newCart = await cartManager.createCart()
                    user.cart = newCart._id
                    await user.save()
                    console.log("Asignando nuevo carrito")
                }
                console.log("Login completado")
                const token = generateToken(user)
                user.token = token
                return done(null, user)
            } catch (error) {
                return done('Error logging in... ' + error)
            }

        }
    ))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })
    
    passport.deserializeUser(async(id, done)=>{
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport
