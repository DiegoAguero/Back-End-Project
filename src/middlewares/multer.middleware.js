import multer from 'multer'
import __dirname from '../utils.js'
const multerStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        if(file.fieldname === 'profile'){
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf' ){
                cb(null, __dirname + '/public/uploads/profile/')
            }else{
                throw new Error('Error trying to upload the identification image: It needs to be an jpg, jpeg or png format!')
            }
        }else if(file.fieldname === 'products'){
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'){
                cb(null, __dirname + '/public/uploads/products/')
            }else{
                throw new Error('Error trying to upload the product image: It needs to be an jpg, jpeg or png format!')
            }
        }else if(file.fieldname === 'documents'){
            if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'application/pdf'){
                cb(null, __dirname + '/public/uploads/documents/')
            }else{
                throw new Error('Error trying to upload the documents: It needs to be an jpg, jpeg, png or pdf format!')
            }
        }
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname);
    }
})
export const uploadMiddleware = multer({storage: multerStorage, dest: __dirname + '/public/uploads', limits: {fileSize: 10000000}}).fields([{name: 'profile', maxCount: 1}, {name: 'products', maxCount: 1}, {name: 'documents', maxCount: 3}])
