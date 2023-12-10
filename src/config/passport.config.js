import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import passportJWT from 'passport-jwt'

import { cartService, userService } from '../services/index.js'
import { logger } from '../services/logger/logger.js'
//.env config
import config from './config.js'
import { createHash, isValidPassword, extractCookie, generateToken } from '../utils.js'

const LocalStrategy = local.Strategy
const JWTStrategy = passportJWT.Strategy
const JWTExtract = passportJWT.ExtractJwt

function initializePassport(){

    passport.use('github', new GitHubStrategy(
        {
            clientID: config.CLIENT_ID_GITHUB,
            clientSecret: config.CLIENT_SECRET_GITHUB,   
            callbackURL: config.CALLBACK_URL_GITHUB,
        },
        async (accessToken, refreshToken, profile, done)=>{
            try{
                const user = await userService.getUserByEmail(profile._json.email)
                if(user){
                    logger.info("User already exists " + profile._json.email)
                }else{
                    const newCartForUser = await cartService.createCart()
                    const newUser = {
                        first_name: profile._json.name,
                        email: profile._json.email,
                        cart: newCartForUser._id,
                        password: ''
                    }
                    await userService.createUser(newUser)
                }
                //Creamos la token para el usuario
                const token = generateToken(user)
                user.token = token
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
            try{
                const {first_name, last_name, age, rol, email} = req.body
                const user = await userService.getUserByEmail(username)
                if(user){
                    logger.info("User already exist")
                    return done(null, false)
                }
                const newCartForUser = await cartService.createCart([])
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    rol,
                    email,
                    cart: newCartForUser._id,
                    password: createHash(password)
                }
                const result = await userService.createUser(newUser)
                return done(null, result)
            }catch(e){
                return done('Error to register: ' + e)
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
                const user = await userService.getUserByEmail(username, true)
                if(!user){
                    logger.error('User doesnt exist')
                    return done(null, false)
                }
                if(!isValidPassword(user, password)){
                    logger.error('Password is not valid')
                    return done(null, false)
                }

                const token = generateToken(user)
                user.token = token
                user.last_connection = new Date()
                await userService.updateUser(user._id, user)
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
        const user = await userService.getUserById(id)
        done(null, user)
    })
}

export default initializePassport
