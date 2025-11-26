
export class ApiUrlConstants {
    static readonly baseUrl = 'http://localhost:3000';

    //PRODUCTS
    static readonly GET_PRODUCTS = `${ApiUrlConstants.baseUrl}/products`;
    static readonly GET_CATEGORIES = `${ApiUrlConstants.baseUrl}/categories`;
    static readonly GET_PRODUCT_BY_CATEGORY = `${ApiUrlConstants.baseUrl}/products/category/`;
    static readonly ADD_PRODUCT_REVIEW = `${ApiUrlConstants.baseUrl}/products/`;
    static readonly SEARCH_PRODUCTS = `${ApiUrlConstants.baseUrl}/search`;

    //CART
    static readonly ADD_TO_CART = `${ApiUrlConstants.baseUrl}/cart/add`;
    static readonly REMOVE_FROM_CART = `${ApiUrlConstants.baseUrl}/cart/remove`;
    static readonly GET_CART = `${ApiUrlConstants.baseUrl}/cart`;

    //AUTH
    static readonly LOGIN = `${ApiUrlConstants.baseUrl}/auth/loginSupa`;
    static readonly REGISTER = `${ApiUrlConstants.baseUrl}/auth/registerSupa`;
    static readonly LOGOUT = `${ApiUrlConstants.baseUrl}/auth/logout`;
    static readonly ME = `${ApiUrlConstants.baseUrl}/auth/me`;

    //PAYMENT
    static readonly INITIATE_PAYMENT = `${ApiUrlConstants.baseUrl}/payment/initiate`;
    static readonly CHECK_PAYMENT_STATUS = `${ApiUrlConstants.baseUrl}/payment/status`;

    //ORDERS
    static readonly GET_ORDER_DETAILS = `${ApiUrlConstants.baseUrl}/orders`;

    //PROFILE
    static readonly GET_ORDERS = `${ApiUrlConstants.baseUrl}/profile/recent-orders`
}

