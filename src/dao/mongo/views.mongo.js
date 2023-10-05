import prodModel from "./models/products.model.js"
export default class ViewManager{
    async getPaginatedProducts(limit, page, sort, status){
        try{
            switch (status) {
                case 'true':
                    status = {status: true}
                    break;
                case 'false':
                    status = {status: false}
                    break;
                default:
                    status = {}
                    break;
            }
            let options = {
                limit, 
                page, 
                lean: true
            }
            if(sort){
                let options = {
                    limit, 
                    page, 
                    sort:{
                        price: sort
                    },
                    lean: true
                }
                console.log(status)
                const products = await prodModel.paginate(status, options)
                products.prevLink = products.hasPrevPage? `/products?page=${products.prevPage}&limit=${limit}&sort=${sort}&status=${status}` : ''
                products.nextLink = products.hasNextPage? `/products?page=${products.nextPage}&limit=${limit}&sort=${sort}&status=${status}` : ''
                return products
            }
            const products = await prodModel.paginate(status, options)
            products.prevLink = products.hasPrevPage? `/products?page=${products.prevPage}&limit=${limit}${status}` : ''
            products.nextLink = products.hasNextPage? `/products?page=${products.nextPage}&limit=${limit}${status}` : ''
            return products

        }catch(e){
            return console.error(e)
        }
    }

}