
export class ApiUrlConstants {
    static readonly baseUrl = 'http://localhost:3000';

    //PRODUCTS
    static readonly GET_PRODUCTS = `${ApiUrlConstants.baseUrl}/products`;
    static readonly GET_CATEGORIES = `${ApiUrlConstants.baseUrl}/categories`;

    //CART
    static readonly ADD_TO_CART = `${ApiUrlConstants.baseUrl}/cart/add`;
    static readonly REMOVE_FROM_CART = `${ApiUrlConstants.baseUrl}/cart/remove`;
    static readonly GET_CART = `${ApiUrlConstants.baseUrl}/cart`;

    //AUTH
    static readonly LOGIN = `${ApiUrlConstants.baseUrl}/auth/loginSupa`;
    static readonly REGISTER = `${ApiUrlConstants.baseUrl}/auth/registerSupa`;
    static readonly LOGOUT = `${ApiUrlConstants.baseUrl}/auth/logout`;

    //PAYMENT
    static readonly INITIATE_PAYMENT = `${ApiUrlConstants.baseUrl}/payment/initiate`;
}
