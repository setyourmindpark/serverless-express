exports.customJwtMessage = customJwtMessage;
exports.customMessage = customMessage;

const formatter = require('./formatter');

function customJwtMessage(code){
    let customMessage = undefined;
    switch (code) {
        case 'E10001':
            customMessage = '토큰이 존재하지않습니다.';
            break;
        case 'E10002':
            customMessage = '토큰이 유효하지않습니다. 토큰을 확인해주세요.';
            break;
        case 'E10003':
            customMessage = '토큰이 만료되었습니다. 재인증해주세요.';
            break;        
    }
    return customMessage;
}

function customAssistantMessage(code, keys){
    const { key, regExp, fileName, fileExt, allowExts, uptoSize } = keys;
    let customMessage = undefined;
    switch (code) {        
        case 'E21001':
            customMessage = '파라미터 ' + key + ' 가 존재하지않습니다.';
            break;
        case 'E21002':
            customMessage = '파라미터 ' + key + ' 의 값은 모두 문자만 가능합니다.';
            break;
        case 'E21003':
            customMessage = '파라미터 ' + key + ' 의 값은 모두 숫자만 가능합니다.';
            break;
        case 'E21004':
            customMessage = '파라미터 ' + key + ' 의 값은 정규식' + regExp + ' 형태만 가능합니다.';
            break;
        case 'E21005':
            customMessage = '파일이름 ' + fileName + ' 의 확장자 ' + fileExt + ' 는 허용되지않습니다. 허용가능한 확장자는 ' + allowExts + ' 입니다.';
            break;
        case 'E21006':
            customMessage = '파일이름 ' + fileName + ' 의 파일크기는 ' + uptoSize + ' 을 초과할수없습니다.'
            break;
    }
    return customMessage;
}


function customMessage(){
    return (middleware, warning) => {
        const { req, res, next } = middleware;
        const { code, msg, keys } = warning;        

        if(code === '9999'){
            res.status(500).send(formatter.apiErrResponse(msg));
            return;
        }

        const customMessage = customJwtMessage(code) ? customJwtMessage(code) : customAssistantMessage(code, keys);        
        res.send(formatter.apiResponse({ resultCode: code, msg: customMessage }));            
    }
}
