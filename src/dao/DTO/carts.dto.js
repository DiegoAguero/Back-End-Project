export default class CartManager{

    constructor(cart){
        this._id = cart?._id ?? ''
        this.products = cart?.products ?? []  
    }

}