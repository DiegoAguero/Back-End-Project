import winston from 'winston'
import config from '../../config/config.js'
// Mirar min 33 hasta final de logger para entender como hacerlo correctamente!
export let logger;
const customLevelOptions = {
    levels:{
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors:{
        fatal: 'red',
        error:'orange',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
    }
}
switch (config.LOGGER) {
    case "DEVELOPMENT":
        logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports:[
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(winston.format.simple())
                }),
                new winston.transports.File({
                    filename: './logs/development.log',
                    level: 'debug',
                    format: winston.format.simple()
                })
            ]
        })
        break;

    case "PRODUCTION":
        logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports:[
                new winston.transports.Console({
                    level: "info",
                    format: winston.format.combine(winston.format.simple())
                }),
                new winston.transports.File({
                    filename: "./logs/production.log",
                    level: "info",
                    format: winston.format.simple()
                })
            ]
        })
        break;
    default:
        logger = winston.createLogger({
            levels: customLevelOptions.levels,
            transports:[
                new winston.transports.Console({
                    level: 'debug',
                    format: winston.format.combine(winston.format.simple())
                }),
                new winston.transports.File({
                    filename: './logs/development.log',
                    level: 'debug',
                    format: winston.format.simple()
                })
            ]
        })
        break;
}
// const loggerDevelopment = winston.createLogger({
//     levels: customLevelOptions.levels,
//     transports:[
//         new winston.transports.Console({
//             level: 'debug',
//             format: winston.format.combine(winston.format.simple())
//         }),
//         new winston.transports.File({
//             filename: './logs/development.log',
//             level: 'debug',
//             format: winston.format.simple()
//         })
//     ]
// })
// const loggerProduction = winston.createLogger({
//     levels: customLevelOptions.levels,
//     transports:[
//         new winston.transports.Console({
//             level: "info",
//             format: winston.format.combine(winston.format.simple())
//         }),
//         new winston.transports.File({
//             filename: "./logs/production.log",
//             level: "info",
//             format: winston.format.simple()
//         })
//     ]
// })
export const addLogger = (req, res, next) =>{
    req.logger = logger

    req.logger.info(`${req.method} on ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}