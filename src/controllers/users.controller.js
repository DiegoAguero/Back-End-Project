import jwt from 'jsonwebtoken';
import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import {logger} from '../services/logger/logger.js'
import { generateUserErrorInfo } from "../services/errors/info.js";
import { userService } from "../services/index.js";
import config from '../config/config.js';
import Mail from '../services/nodemailer/mail.js';

const mail = new Mail()
export const getAllUsers = async (req, res)=>{
    try {
        let populate = req.query?.populate || false
        populate = populate === "false" ? false : true
        return await userService.getAllUsers(populate)

    } catch (error) {
        return console.error(error)
    }
}

export const createUser = async (req, res)=>{
    try {
        const user = req.body
        if(!user.first_name || !user.email){
            return CustomError.createError({
                name: "User creation error",
                cause: generateUserErrorInfo(user),
                message: "Error trying to create the user",
                code: EErrors.INVALID_TYPE_ERROR
            })
        } 
        const userCreated = await userService.createUser(user)
        if(!userCreated) return res.send({status: 'error', payload: 'Unable to create the user!'})
        return res.send({status: 'success', payload: user})
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserById = async(req, res)=>{
    const userId = req.params.uid
    try {
        const getUser = await userService.getUserById(userId, true)
        return res.send({status:'success', payload: getUser})
    } catch (error) {
        CustomError.createError({
            name: "Get user error",
            cause: generateUserErrorInfo(userId),
            message: "User not found",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
}
export const getUserByEmail = async (req, res)=>{
    const email = req.params.email
    try {
        const getUser = await userService.getUserByEmail(email, true)
        return res.send({status:'success', payload: getUser})
    } catch (error) {
        CustomError.createError({
            name: "Get user error",
            cause: generateUserErrorInfo(email),
            message: "User not found",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
}
export const changeUserRol = async (req, res)=>{
    const userId = req.params.uid
    try {
        const getUser = await userService.getUserById(userId)
        let uploadedDocuments = 0;
        let contador = 1;
        getUser.documents.forEach(document =>{
            if(document.reference?.split('\\'[11] === 'documents') && document.name != document.name[contador++]){
                uploadedDocuments++
            }
        })
        if(uploadedDocuments === 3){
            getUser.rol = 'premium'        
        }else{
            return res.json(`No puedes ser premium todavia! Tienes que subir ${3 - uploadedDocuments} documento/s más para poder serlo!`)
        }
        const saveUser = await userService.updateUser(userId, getUser)
        return res.send({status: 'success', payload: saveUser})

    } catch (error) {
        CustomError.createError({
            name: "Change role error",
            cause: generateUserErrorInfo(userId),
            message: error,
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
}

export const resetPassword = async (req, res)=>{
    
    const {email} = req.body
    const userExists = await userService.getUserByEmail(email)
    if(!userExists){
        CustomError.createError({
            name: "Reset password error",
            cause: generateUserErrorInfo(email),
            message: "User not found",
            code: EErrors.INVALID_TYPE_ERROR
        })
    }
    const newSecret = config.SECRET_JWT + userExists.password
    const payload = {
        email: userExists.email,
        id: userExists._id
    }
    const token = jwt.sign(payload, newSecret, { expiresIn: '1h' })
    const resetLink = `http://127.0.0.1:8080/resetPassword/${userExists._id}/${token}`
    let html =  `Here's the link to reset your password! You only got 1 hour to use it before it expires. ${resetLink} `
    mail.send(userExists, "Reset password", html)
    return res.send('A link to reset your password has been sent to your email!')
    //Reset password
}

export const uploadDocuments = async(req, res)=>{
    const userId = req.params.uid
    const files = req.files
    

    const documents = await userService.uploadDocuments(userId, files)
    console.log(documents)
    //hacer logica de actualizar user.documents y ponerle la ruta de los documentos que subió
    return res.json(req.files)
}

