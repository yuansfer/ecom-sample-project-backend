const _success = (data = [], message) => {
    return {
        success: true,
        data: data,
        message: message
    }
}

const _error = (data = [], message) => {
    return {
        error: true,
        data: data,
        message: message,
    }
}

const _error1 = (status, message, data) => {
    return {
        error: true,
        status: status,
        message: message,
        data: data,
    }
}

const _notifications = {
    product: {
        add: 'Product Added',
        edit: 'Product Updated',
        delete: 'Product Deleted',
    }
}

const _purchaseMode = {
    BUY: 'buy',
    SUBSCRIBE: 'subscribe',
}

const _messages = {

    TOKEN_REFRESHED_SUCCESS: 'Token Refreshed Successfully',
    TOKEN_MISSING: 'Token is missing',
    REFRESH_TOKEN_MISSING: 'Refresh Token is missing',
    INVALID_TOKEN: 'Invalid Token',
    UNAUTHORIZED_ACCESS: 'Unauthorized Access',
    ACCESS_DENIED: 'Access Denied',

    ROLE_MISSING: 'User Role is missing',
    USER_TYPE_MISSING: 'User Type is missing',
    FIRST_NAME_MISSING: 'First Name is missing',
    LAST_NAME_MISSING: 'Last Name is missing',
    EMAIL_MISSING: 'Email is missing',

    REGISTER_SUCCESS: 'Registered Successfully',
    USER_EXIST: 'User Already Exist',

    USERNAME_MISSING: 'Username is missing',
    PASSWORD_MISSING: 'Password is missing',
    INVALID_CREDENTIAL: 'Invalid Username or Password',
    LOGIN_SUCCESS: 'Login Successful',
    LOGOUT_SUCCESS: 'Logout Successful',

    MERCHANT_NO_MISSING: 'Merchant Number is missing',
    MERCHANT_STORE_NO_MISSING: 'Merchant Store Number is missing',
    MERCHANT_TOKEN_MISSING: 'Merchant Token is missing',
    MERCHANT_ENVIRONMENT_MISSING: 'Merchant Environment is missing',
    CURRENCY_MISSING: 'Currency is missing',
    SETTLE_CURRENCY_MISSING: 'Settle Currency is missing',
    TERMINAL_MISSING: 'Terminal is missing',

    VENDOR_MISSING: 'Vendor is missing',

    UNKNOWN_USER: 'Unknown User',
    UNKNOWN_CART: 'Unknown Cart',
    UNKNOWN_ORDER: 'Unknown Order',
    CART_EMPTY: 'Cart is Empty',
    CUSTOMER_MISSING: 'Customer is missing',
    PRODUCT_MISSING: 'Product is missing',
    PRODUCT_SIZE_MISSING: "Product's Size is missing",
    PRODUCT_QTY_INVALID: "Invalid Product Quantity",
    SUBSCRIPTION_MONTH_MISSING: "Subscription Month is missing",
    SHIPPING_ADDRESS_MISSING: "Shipping Address is missing",
    SHIPPING_CITY_STATE_MISSING: "Shipping City,State is missing",
    SHIPPING_COUNTRY_MISSING: "Shipping Country is missing",
    SHIPPING_EMAIL_MISSING: "Shipping Email is missing",
    SHIPPING_PHONE_MISSING: "Shipping Phone is missing",
    UNKNOWN_CART_PRODUCT: "Unknown Product in Cart",
    REDIRECT_URL_MISSING: "Redirect URL is missing",
    AUTO_DEBIT_NUMBER_EMPTY: 'Auto Debit Number not found',
    NO_SUCH_PRODUCT_IN_CART: 'No Such Product In Cart',
    CART_UPDATED: 'Cart Updated Successfully',
    SUBSCRIBED_PRODUCT_UPDATED: 'Subscribed Product Updated Successfully',
    PRODUCT_ADDED: 'Product Added Successfully',
    PRODUCT_REMOVED: 'Product Removed Successfully',
    PRODUCT_SUBSCRIBED: 'Product Subscribed Successfully',
    SHIPPING_ADDRESS_UPDATED: 'Shipping Address Updated Successfully',
    ORDER_CREATE_ISSUE: 'Issue in create order',

    PAYMENT_DONE: 'Payment Done Successfully',
    REFUND_INITIATED: 'Refund Initiated Successfully',
    AUTHORIZE_SUCCESS: 'Authorize Consulted Successfully',
    AUTHORIZE_ERROR: 'Authorize Consulted Error',
    AUTO_DEBIT_PAYMENT_SUCCESS: 'Auto Debit Payment Successfully',
    AUTO_DEBIT_PAY_REVOKED_SUCCESS: 'Auto Debit Pay Revoked Successfully',
    NO_SUBSCRIPTION_FOUND: 'No subscription found',
}

module.exports = {
    _success,
    _error,
    _error1,
    _notifications,
    _messages,
    _purchaseMode
};