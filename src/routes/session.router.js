import { Router } from 'express'
import passport from 'passport'

import { authToken } from '../utils.js'
import { current, githubLogin, login, logout, register } from '../controllers/session.controller.js'

const router = Router()

router.post('/login', passport.authenticate('login', '/login'), login)
router.post('/register', passport.authenticate('register', '/register'), register)
router.get('/logout', logout)

//Gituhb route
router.get('/login-github', passport.authenticate('github', {scope: ['user:email']}))
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/'}), githubLogin)
router.get('/current', authToken, current)
export default router