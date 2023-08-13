import passport from 'passport'
import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import GitHubStrategy from 'passport-github2'

const LocalStrategy = local.Strategy
// App ID: 375167
// Client ID: Iv1.bde27374545eed48
// Secret: 458779cf168171d5fc50e7d98d644bb0e5238da5

function initializePassport(){

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.bde27374545eed48',
            clientSecret: '458779cf168171d5fc50e7d98d644bb0e5238da5',   
            callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback',
            //Tuve que añadir estos dos campos para que pueda funcionar
            //El codigo, porque profile._json.email no existía
            //De esta forma, usando profile.emails[0].value puedo
            //Extraer el email y me permite usarlo
            proxy: true,
            scope: ['user:email']
        },
        async (accessToken, refreshToken, profile, done)=>{
            console.log(profile)
            try{
                const user = await userModel.findOne({email: profile.emails[0].value})
                if(user){
                    console.log("User already exists " + profile.emails[0].value)
                    return done(null, user)
                }else{
                    const newUser = {
                        name: profile._json.name,
                        email: profile.emails[0].value,
                        password: ''
                    }
                    const result = await userModel.create(newUser)
                    return done(null, result)
                }
            }catch(e){
                return done("Error to log-in with Github. " + e)
            }
        }
    ))
    //Esto funciona como un middleware
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        }, 
        async(req, username, password, done)=>{
            const {name, email} = req.body
            try{
                const user = await userModel.findOne({email: username})
                if(user){
                    console.log("User already exist")
                    return done(null, false)
                }
                const newUser = {
                    name,
                    email,
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
                const user = await userModel.findOne({email: username}).lean().exec()
                if(!user){
                    console.error('User doesnt exist')
                    return done(null, false)
                }
                if(!isValidPassword(user, password)){
                    console.error('Password is not valid')
                    return done(null, false)
                }
    
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
