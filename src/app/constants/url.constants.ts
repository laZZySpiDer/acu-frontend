
export class ApiUrlConstants {
    static readonly baseUrl = 'http://localhost:3000';
    static readonly GET_PRODUCTS = `${ApiUrlConstants.baseUrl}/products`;
    static readonly GET_CATEGORIES = `${ApiUrlConstants.baseUrl}/categories`;
    static readonly LOGIN = `${ApiUrlConstants.baseUrl}/auth/loginSupa`;
    static readonly REGISTER = `${ApiUrlConstants.baseUrl}/auth/registerSupa`;
    static readonly LOGOUT = `${ApiUrlConstants.baseUrl}/auth/logout`;
}
