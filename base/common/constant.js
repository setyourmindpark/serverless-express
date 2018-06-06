//이곳에 상수를 세팅하여 에러 메시지 코드 등을 정의할것임 .

const constant = {};

//jwt
constant.JWT_EMPTY_TOKEN = { 
    code: 'E10001', 
    msg: 'empty token'     
}

constant.JWT_INVALID_TOKEN = { 
    code: 'E10002', 
    msg: 'invalid token'    
}

constant.JWT_EXPIRE_TOKEN = { 
    code: 'E10003',
    msg: 'expire token'     
}

//validate value and property
constant.PARAMETER_NOT_EXSIST = key => {
    return {
        code: 'E21001',
        msg: 'parameter [ ' + key + ' ] is not exist. pleace check parameter ',
        keys: {
            key : key
        }        
    }
}

constant.VALIDATE_VALUE_NOT_ONLY_CHARACTERS = key => {
    return {
        code: 'E21002',
        msg: 'parameter value of [ ' + key + ' ] is not only characters(string)',
        keys: {
            key: key
        }        
    }
}

constant.VALIDATE_VALUE_NOT_ONLY_NUMBER = key => {
    return {
        code: 'E21003',
        msg: 'parameter value of [ ' + key + ' ] is not only number',
        keys: {
            key: key
        }        
    }
}

constant.VALIDATE_WRONG_REGEXP_FORMAT = (key, regExp) => { 
    return {
        code: 'E21004', 
        msg: 'parameter [ ' + key + ' ] is not [ ' + regExp + ' ] format',
        keys: {
            key: key,
            regExp: regExp
        }        
    }
}

//validate multipart
constant.MULTIPART_NOT_ALLOW_FILE_EXT = (fileName, fileExt, allowExts) => {
    return {
        code: 'E21005',
        msg: '[ ' + fileName + ' ] extension is not allow [ ' + fileExt + ' ]. only allow [ ' + allowExts + ' ]',
        keys: {
            fileName: fileName,
            fileExt: fileExt,
            allowExts: allowExts
        }       
    }
}

constant.MULTIPART_CAN_NOT_EXCEED_CAPACITY = (fileName, uptoSize) => {
    return {
        code: 'E21006',
        msg: '[ ' + fileName + ' ] can not exceed [ ' + uptoSize + ' ]',
        keys: {
            fileName: fileName,
            uptoSize: uptoSize
        }               
    }
}

//system someting wrong
constant.MSG_SYSTEM_ERROR = 'server error'

//code
constant.CODE_SYSTEM_PROCESS_DONE = '0001'      // system process is done done  시스템로직 정상처리코드
constant.CODE_SYSTEM_PROCESS_ERROR = '9999'     // system process error code    시스템로직 예상치못한오류

module.exports = constant;
