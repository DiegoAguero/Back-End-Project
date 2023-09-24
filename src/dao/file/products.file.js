import fs from 'fs'
let contenidoObj = ''
export default class ProductManager {
    #path
    constructor(path) {
        this.#path = path
        this.products = []
    }

    getNextID() {
        const id = this.products.length;
        const nextID = (id > 0) ? id + 1 : 1
        return nextID;
    }
    addProduct(title, description, price, thumbnail, code, stock, status=true) {
        const product = {
            id: this.getNextID(),
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status
        }
        if (title === undefined || description === undefined || price === null || stock === undefined || code === undefined || !title || !description || !price || !stock || !code) {
            return "Error, hay un campo incompleto. Se borrará el producto. Vuelva a introducir los datos nuevamente"
        } else {
            this.products.push(product)
            const productStr = JSON.stringify(this.products)
            fs.writeFileSync(this.#path, productStr)
            if (this.products.length >= 2) {
                for (let value in this.products) {
                    let numeroIterado = parseInt(value) + 1
                    if (this.products[value].code == this?.products[numeroIterado]?.code) {
                        console.log('Error, objeto repetido: ', this.products[numeroIterado])
                        this.products.pop()
                    }
                }
            }
        }
    }
    getProducts() {
        const contenido = fs.readFileSync(this.#path, 'utf-8')
        contenidoObj = JSON.parse(contenido)
        return contenidoObj
    }
    getProductById(id) {
        this.getProducts()

        const encontrado = contenidoObj.find((prod) => prod.id === Number(id))
        if (encontrado === undefined) {
            console.log("Not found")
            return encontrado
        } else {
            console.log('Producto encontrado:', encontrado)
            return encontrado
        }
    }
    deleteProduct(id) {
        this.getProducts()
        const encontrado = contenidoObj.filter(prod => prod.id !== id)
        const prodStr = JSON.stringify(encontrado)
        fs.writeFileSync(this.#path, prodStr)

    }
    updateProduct(id, product){
        this.getProducts()
        
        const encontrar = contenidoObj.find((prod)=> prod.id === id)
        const {title, description, price, thumbnail, code, stock, status} = product
        encontrar.title = title
        encontrar.description = description
        encontrar.price = price
        encontrar.thumbnail = thumbnail
        encontrar.code = code
        encontrar.stock = stock
        encontrar.status = status
        const prodObj = JSON.stringify(contenidoObj)
        fs.writeFileSync(this.#path, prodObj)
    }
}

// const prod = new ProductManager('products.json')
// prod.addProduct('Botella de plastico', 'Hola soy una botella de plastico que tiene agua', 20, 'url', '123', 30)
// prod.addProduct('Lolapalooza', 'Hola 12', 30, 'url', '123', 60)
// prod.addProduct('Matias Spaciusk', '', 30, 'rs', 'ss', 30)
    