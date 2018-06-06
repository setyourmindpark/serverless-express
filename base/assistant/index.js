//assistant 폴더는 미들웨어에서 처리하는 로직에대한 파일을 모두 넣음 .
//assistant 이외의 폴더에는 controller에서 로직수행중에 필요한 로직에대한 폴더임.

/**
 * Module exports.
 * @public
 */
exports.validate = validate;
exports.unifyAllProps = unifyAllProps;
//http://www.codejs.co.kr/useful-regular-expression/?ckattempt=1

/**
 * Module dependencies.
 * @private
 */
const validator = require('./validator');
// const uploader = require('./uploader');
const constant = require('@root/base/common/constant');
const formatter = require('@root/base/common/formatter');

/**
* 유효성검사를 수행
* @param {JSON, function}   
* ex) {파라미터이름 : {require : true, type : string or regExp},  ...  }   //get 방식의 api 요청일경우 default는 string.
* customHandleFunction validate 수행결과를 callback으로 router( 호출시점 ) 에서 받을시 정의하여 사용. callback으로 보내줌.( middleware, validate result )
* customHandleFunction default는 base formatter에서 바로 response를 validate code와 message를 response 함.
* @return {express middlware}
* @public
*/
function validate({ params: toValidateParam, body: toValidateBody, query: toValidateQuery, multipart: toValidateMultipart }, customHandleFunction) {
    return async (req, res, next) => {
        try {
            const { params: reqParams, query: reqQuery, body: reqBody } = req;

            if (toValidateParam) {
                const { isValidate, code, msg, keys } = validator.validateParams(reqParams, toValidateParam);
                if (!isValidate) {
                    if (customHandleFunction) {
                        customHandleFunction(
                            { req, res, next },
                            { code: code, msg: msg, keys: keys })
                    } else {
                        res.send(formatter.apiResponse({ resultCode: code, msg: msg }));
                    }
                    return;
                }
            }

            if (toValidateQuery) {
                const { isValidate, code, msg, keys } = validator.validateQuery(reqQuery, toValidateQuery);
                if (!isValidate) {
                    if (customHandleFunction) {
                        customHandleFunction(
                            { req, res, next },
                            { code: code, msg: msg, keys: keys })
                    } else {
                        res.send(formatter.apiResponse({ resultCode: code, msg: msg }));
                    }
                    return;
                }
            }

            if (toValidateBody) {
                const { isValidate, code, msg, keys } = validator.validateBody(reqBody, toValidateBody);
                if (!isValidate) {
                    if (customHandleFunction) {
                        customHandleFunction(
                            { req, res, next },
                            { code: code, msg: msg, keys: keys })
                    } else {
                        res.send(formatter.apiResponse({ resultCode: code, msg: msg }));
                    }
                    return;
                }
            }

            // if (toValidateMultipart) {
            //     const { isValidate, inspectedObj, code, msg, keys } = await validator.validateMultipart(req, toValidateMultipart);
            //     if (!isValidate) {
            //         if (customHandleFunction) {
            //             customHandleFunction(
            //                 { req, res, next },
            //                 { code: code, msg: msg, keys: keys })
            //         } else {
            //             res.send(formatter.apiResponse({ resultCode: code, msg: msg }));
            //         }
            //         return;
            //     } else {
            //         const { files: toValidateFile } = toValidateMultipart;
            //         await uploader.upload(req, inspectedObj, toValidateFile);
            //     }
            // }
            next();
        } catch (err) {
            console.log(err);
            if (customHandleFunction) {
                customHandleFunction(
                    { req, res, next },
                    { code: constant.CODE_SYSTEM_PROCESS_ERROR, msg: constant.MSG_SYSTEM_ERROR })
            } else {
                res.status(500).send(formatter.apiErrResponse(err));
            }
        }
    }
}

/**
* request 로 들어온 모든 paramter 를 rep.prop 프로퍼티에 바인딩
* @param
* @return {express middlware}
* @public
*/
function unifyAllProps() {
    return (req, res, next) => {
        req.prop = Object.assign(
            req.prop || {},
            req.user || {},
            req.query || {},
            req.params || {},
            req.body || {},
            req.files || {},
            req.fields || {}
        );
        logger.info('--------------------------- request data start ---------------------------');
        logger.info(JSON.stringify(req.prop));
        logger.info('--------------------------- request data end   ---------------------------');
        next();
    }
}

