/**
 * Module exports.
 * @public
 */
exports.validateParams = validateParams;
exports.validateQuery = validateQuery;
exports.validateBody = validateBody;
exports.validateMultipart = validateMultipart;

const file = require('@root/base/common/file');
const lowerCase = require('lower-case')
const constant = require('@root/base/common/constant');
const bytes = require('bytes');
const Busboy = require('busboy');

//숫자만 존재하는지 체크
function isOnlyNumber(str) {
    return /^\d+$/.test(str)
}

//숫자가 하나라도 존재하는지 체크
function isExsistNumber(str) {
    return /[0-9]/g.test(str)
}

function validateParams(paramObj, toCheckObj) {

    for (let key of Object.keys(toCheckObj)) {
        const paramVal = paramObj[key];
        const toValidateObj = toCheckObj[key];
        const { v_type } = toValidateObj;

        const { isValidate, code, msg, keys } = validateValue(paramVal, v_type, key);
        if (!isValidate) {
            return {
                isValidate: false,
                code: code,
                msg: msg,
                keys: keys
            }
        }

    }
    return {
        isValidate: true
    }
}

function validateQuery(paramObj, toCheckObj) {
    const { isValidate, code, msg, keys } = validateBody(paramObj, toCheckObj);
    if (!isValidate) {
        return {
            isValidate: false,
            code: code,
            msg: msg,
            keys: keys
        }
    }

    return {
        isValidate: true
    }
}

function validateBody(paramObj, toCheckObj) {

    for (let key of Object.keys(toCheckObj)) {
        const paramVal = paramObj[key];
        const toValidateObj = toCheckObj[key];
        const { v_type, require} = toValidateObj;

        const { isValidate, code, msg, keys } = validateRequire(paramVal, require, key);
        if (!isValidate) {
            return {
                isValidate: false,
                code: code,
                msg: msg,
                keys: keys
            }
        }

        if (paramVal) {
            const { isValidate, code, msg, keys } = validateValue(paramVal, v_type, key);
            if (!isValidate) {
                return {
                    isValidate: false,
                    code: code,
                    msg: msg,
                    keys: keys
                }
            }

        }

    }
    return {
        isValidate: true
    }
}

async function validateMultipart(req, toCheckObj) {
    const { files: toValidateFiles, fields: toValidateFields } = toCheckObj;
    const { isProcessed, data: inspectedData } = await inspectFieldsWithAllowFiles(req, toValidateFiles);
    const { files: inspectedFiles, fields: inspectedFields } = inspectedData;

    if (isProcessed) {
        {   //temp block scope
            const { isValidate, code, msg, keys } = validateFile(inspectedFiles, toValidateFiles);
            if (!isValidate) {
                
                return {
                    isValidate: false,
                    code: code,
                    msg: msg,
                    keys: keys
                }
            }
        }

        {   //temp block scope
            const { isValidate, code, msg, keys } = validateBody(inspectedFields, toValidateFields);
            if (!isValidate) {
                
                return {
                    isValidate: false,
                    code: code,
                    msg: msg,
                    keys: keys
                }
            }
        }
    }
    return {
        isValidate: true,
        inspectedObj: {
            inspectedFiles: inspectedFiles,
            inspectedFields: inspectedFields
        }
    }
}

function validateValue(paramVal, v_type, key) {

    if (v_type === 'any') {
        return {
            isValidate: true
        }
    }

    if (v_type === 'onlyChar') {                 //파리미터 value 타입 only characters 여부 검사
        if (isExsistNumber(paramVal)) {                       //값의 모든 문자가 숫자가 아니면 '문자' 라고 취급할것임 .
            const { code, msg, keys } = constant.VALIDATE_VALUE_NOT_ONLY_CHARACTERS(key);
            return {
                isValidate: false,
                code: code,
                msg: msg,
                keys: keys
            }
        }
    }

    if (v_type === 'onlyNum') {                  //파리미터 value 타입 only number 여부 검사
        if (!isOnlyNumber(paramVal)) {
            const { code, msg, keys } = constant.VALIDATE_VALUE_NOT_ONLY_NUMBER(key);
            return {
                isValidate: false,
                code: code,
                msg: msg,
                keys: keys
            }
        }
    }

    if (v_type instanceof RegExp) {
        const isValidate = v_type.test(paramVal);
        if (!isValidate) {
            const { code, msg, keys } = constant.VALIDATE_WRONG_REGEXP_FORMAT(key, v_type);
            return {
                isValidate: false,
                code: code,
                msg: msg,
                keys: keys
            }
        }
        return {
            isValidate: true
        }
    }

    return {
        isValidate: true
    }
}

function validateRequire(paramVal, require, key) {

    if (require) {                      //파라미터가 반드시 requre true 인경우
        if (!paramVal) {                //파라미터가 존재하지않을경우
            const { code, msg, keys } = constant.PARAMETER_NOT_EXSIST(key);
            return {
                isValidate: false,
                code: code,
                msg: msg,
                keys: keys
            }
        }
    }

    return {
        isValidate: true
    }
}

function validateFile(inspectedObj, toCheckObj){
    
    for (let key of Object.keys(toCheckObj)) {

        const paramObj = inspectedObj[key];
        const toValidateObj = toCheckObj[key];
        const { uptoSize, require, allowExt} = toValidateObj;

        const { isValidate, code, msg, keys } = validateRequire(paramObj, require, key);
        if (!isValidate) {
            return {
                isValidate: false,
                code: code,
                msg: msg,
                keys: keys
            }
        }

        if (paramObj) {
            const { buffer, fileName } = paramObj;
            const { isValidate, code, msg, keys } = validateFileExt(fileName, allowExt);

            if (!isValidate) {
                return {
                    isValidate: false,
                    code: code,
                    msg: msg,
                    keys: keys
                }
            }

            if (!(uptoSize === 'any')) {
                const { isValidate, code, msg, keys } = validateUptoSize(buffer, uptoSize, fileName, key);

                if (!isValidate) {
                    return {
                        isValidate: false,
                        code: code,
                        msg: msg,
                        keys: keys
                    }
                }
            }
        }
    }
    return {
        isValidate : true
    }
}

function validateFileExt(fileName, allowExt) {    
    if (allowExt === 'any') {
        return {
            isValidate: true
        }
    }

    const fileExt = lowerCase(file.fileExt(fileName));
    if (!allowExt.includes(fileExt)) {
        const { code, msg, keys } = constant.MULTIPART_NOT_ALLOW_FILE_EXT(fileName, fileExt, allowExt);
        return {
            isValidate: false,
            code: code,
            msg: msg,
            keys: keys
        }
    }
    return {
        isValidate: true
    }
}

function validateUptoSize(buffer, uptoSize, fileName, key) {

    const byte_uptoSize = parseInt(bytes(uptoSize));
    const byte_bufferSize = parseInt(buffer.length);

    if (byte_bufferSize >= byte_uptoSize) {        
        const { code, msg, keys } = constant.MULTIPART_CAN_NOT_EXCEED_CAPACITY(fileName, uptoSize);
        return {
            isValidate: false,
            code: code,
            msg: msg,
            keys: keys
        }
    }
    return {
        isValidate: true
    }
}


async function inspectFieldsWithAllowFiles(req, toValidateFiles) {
    return new Promise((resolve, reject) => {
        const container = {};
        container.files = {};
        container.fields = {};
        const busboy = new Busboy({ headers: req.headers });

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            const isValidateFile = toValidateFiles[fieldname];      // 유효성 object에 포함되지않는 file field가 넘어올시 무시한다 .
            // 임시로 저장할 buffer 사이즈가 너무커질 우려가존재하기에 이곳에서 로직처리를 한다 .
            let buffers = [];

            file.on('data', function (data) {
                if (!isValidateFile) return false;                     // 무시한다. 버퍼에 저장하지않는다
                buffers.push(data);
            });

            file.on('end', function () {
                if (!isValidateFile) return false;                     // 무시한다.
                const obj = {};
                obj[fieldname] = { fileName: filename, buffer: Buffer.concat(buffers) };
                container.files = Object.assign(container.files, obj);
            });

        });

        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            if (val === 'undefined') return false;
            const obj = {};
            obj[fieldname] = val;
            container.fields = Object.assign(container.fields, obj);
        });

        busboy.on('finish', function () {
            resolve({
                isProcessed: true,
                data: container
            })
        });
        req.pipe(busboy);
    })
}
