const errorMessage = {
    //400
    badRequest: 'Invalid Inputs',
    //404
    unknown: 'Not found',
    //403
    forbidden: 'Resource forbidden',
    //402
    paymentRequired: 'Payment required',
    //401
    unauthorised: 'Unauthorised',
    //416
    unsuported: 'Media type not supported.',

    //server error

    //500
    serverError: 'Some Error Occured.Try again later.',
    //504
    timeOut: 'Gateway timeout occured'
};
module.exports = errorMessage;