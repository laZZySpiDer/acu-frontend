import { environment } from '../../environments/environment';

export class ApiUrlConstants {
    static readonly baseUrl = environment.baseUrl;

    //PRODUCTS
    static readonly GET_PRODUCTS = `${ApiUrlConstants.baseUrl}/products`;
    static readonly GET_TRENDING_PRODUCTS = `${ApiUrlConstants.baseUrl}/products/trending-products`;
    static readonly GET_CATEGORIES = `${ApiUrlConstants.baseUrl}/categories`;
    static readonly GET_PRODUCT_BY_CATEGORY = `${ApiUrlConstants.baseUrl}/products/category/`;
    static readonly ADD_PRODUCT_REVIEW = `${ApiUrlConstants.baseUrl}/products/`;
    static readonly SEARCH_PRODUCTS = `${ApiUrlConstants.baseUrl}/search`;

    //CART
    static readonly ADD_TO_CART = `${ApiUrlConstants.baseUrl}/cart/add`;
    static readonly REMOVE_FROM_CART = `${ApiUrlConstants.baseUrl}/cart/remove`;
    static readonly GET_CART = `${ApiUrlConstants.baseUrl}/cart`;
    static readonly CLEAR_CART = `${ApiUrlConstants.baseUrl}/cart`;

    //AUTH
    static readonly LOGIN = `${ApiUrlConstants.baseUrl}/auth/loginSupa`;
    static readonly REGISTER = `${ApiUrlConstants.baseUrl}/auth/registerSupa`;
    static readonly LOGOUT = `${ApiUrlConstants.baseUrl}/auth/logout`;
    static readonly ME = `${ApiUrlConstants.baseUrl}/auth/me`;
    static readonly LOGIN_GOOGLE = `${ApiUrlConstants.baseUrl}/auth/loginGoogle`;
    static readonly GOOGLE_LOGIN_WITH_TOKEN = `${ApiUrlConstants.baseUrl}/auth/google-token`;
    static readonly OAUTH_CALLBACK = `${ApiUrlConstants.baseUrl}/auth/oauth-callback`;
    static readonly UPDATE_PROFILE = `${ApiUrlConstants.baseUrl}/profile/update`;
    static readonly UPDATE_PASSWORD = `${ApiUrlConstants.baseUrl}/auth/update-password`;
    static readonly RESET_PASSWORD = `${ApiUrlConstants.baseUrl}/auth/reset-password`;
    static readonly FORGOT_PASSWORD = `${ApiUrlConstants.baseUrl}/auth/forgot-password`;
    static readonly CHANGE_PASSWORD = `${ApiUrlConstants.baseUrl}/auth/change-password`;

    //PAYMENT
    static readonly INITIATE_PAYMENT = `${ApiUrlConstants.baseUrl}/payment/initiate`;
    static readonly CHECK_PAYMENT_STATUS = `${ApiUrlConstants.baseUrl}/payment/status`;

    //ORDERS
    static readonly GET_ORDER_DETAILS = `${ApiUrlConstants.baseUrl}/orders`;

    //PROFILE
    static readonly GET_ORDERS = `${ApiUrlConstants.baseUrl}/profile/recent-orders`
    static readonly UPLOAD_ORDER_IMAGES = `${ApiUrlConstants.baseUrl}/orders/upload-images`;
    static readonly TRACK_ORDER = `${ApiUrlConstants.baseUrl}/orders/track/:id`;

    //EXPERIENCE
    static readonly WORKSHOP_INTEREST = `${ApiUrlConstants.baseUrl}/workshops/interest`;

    // COUPONS
    static readonly VALIDATE_COUPON = `${ApiUrlConstants.baseUrl}/coupons/validate`;

    // WISHLIST
    static readonly WISHLIST_ADD = `${ApiUrlConstants.baseUrl}/wishlist/add`;
    static readonly WISHLIST_REMOVE = `${ApiUrlConstants.baseUrl}/wishlist/remove`;
    static readonly WISHLIST_GET = `${ApiUrlConstants.baseUrl}/wishlist`;
}

