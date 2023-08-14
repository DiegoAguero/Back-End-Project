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


            try{
                console.log(profile)
                const githubName = profile._json.name
                const nameDivided = githubName.split(' ')
                let firstName = nameDivided[0]
                let lastName
                if(nameDivided.length > 1){
                    lastName = nameDivided.slice(1).join(' ')
                }
                const user = await userModel.findOne({email: profile._json.email})
                if(user){
                    console.log("User already exists " + profile._json.email)
                    return done(null, user)
                }else{
                    const newUser = {
                        first_name: firstName,
                        last_name: lastName,
                        email: profile._json.email,
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
            const {first_name, last_name, age, rol, email} = req.body
            try{
                const user = await userModel.findOne({email: username})
                if(user){
                    console.log("User already exist")
                    return done(null, false)
                }
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    rol,
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
                    const user = {_id: mongoObjectId, email: username, password, rol: 'admin'}
                    return done(null, user)

                }
                const user = await userModel.findOne({email: username}).lean().exec()
                if(!user){
                    console.error('User doesnt exist')
                    return done(null, false)
                }
                if(!isValidPassword(user, password)){
                    console.error('Password is not valid')
                    return done(null, false)
                }
                console.log("Login completado")
                return done(null, user)
            } catch (error) {
                return done('Error logging in... ' + error)
            }

        }
    ))

    passport.serializeUser((user, done)=>{
        console.log(user)
        done(null, user._id)
    })
    
    passport.deserializeUser(async(id, done)=>{
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport
