//Describir los siguientes errores
export const generateUserErrorInfo = (user) => {
    return `
    One or more properties are invalid or incomplete
    Lists of required properties:
        first_name: Must be a string (${user?.first_name})
        age: Must be a Number (${user?.age})
        email: Must be a string (${user?.email})
    `
}
export const generateTicketErrorInfo = (amount, purchaser, code) =>{
    return `
    One or more properties are invalid or incomplete
    List of required properties:
        amount: Must be a Number (${amount})
        purchaser: Must be a string (${purchaser})
        code: Must be a string (${code})
    `	
}
