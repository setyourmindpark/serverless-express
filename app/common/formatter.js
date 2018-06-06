
exports.apiResponse = apiResponse;
exports.apiErrResponse = apiErrResponse;

const response = require('./constant/response');

function apiResponse({ resultCode, code, msg, pagenationInfo, data }) {
    if (resultCode) {
        logger.info('--------------------------- [ app ] identified info start ---------------------------');
        logger.info('identified code : ' + resultCode + '   identified msg : ' + msg);
        logger.info('--------------------------- [ app ] identified info end -----------------------------');
    }
    return {
        resultCode: resultCode || response.CODE_SYSTEM_PROCESS_DONE,
        body: {
            msg: msg,
            code: code,
            pagenationInfo: pagenationInfo,
            data: data
        }
    }
}

function apiErrResponse(err) {
    logger.info('--------------------------- [ app ] unexpected system error start ---------------------------');
    logger.info(err);
    logger.info('--------------------------- [ app ] unexpected system error end -----------------------------');
    return {
        resultCode: response.CODE_SYSTEM_PROCESS_ERROR,
        msg: response.MSG_SYSTEM_ERROR
    };
}
