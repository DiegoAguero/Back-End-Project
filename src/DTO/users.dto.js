export default class UserManager{
    constructor(user){
        this._id = user._id;
        this.first_name = user?.first_name ?? ''
        this.last_name = user?.last_name ?? ''
        this.email = user?.email ?? ''
        this.age = user?.age ?? 0
        this.password = user?.password ?? ''
        this.cart = user?.cart ?? ''
        this.rol = user?.rol ?? 'user'
        this.last_connection = user?.last_connection ?? new Date()
        this.documents = user?.documents ?? []
    }
}   