import nodemailer from 'nodemailer'
import config from '../../config/config.js'
import {logger} from '../logger/logger.js'
export default class Mail{
    constructor(){
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth:{
                user: config.MAIL_USER,
                pass: config.MAIL_PASSWORD
            }
        })
    }

    send = async(user, subject, html)=>{
        const result = await this.transport.sendMail({
            from: config.MAIL_USER,
                to: user.email,
                subject,
                html
        })
        logger.info(result)
        return result
    }
}