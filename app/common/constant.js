const constant = {};

constant.JWT_NOT_MATCH_TWO_TOKEN = { code: 'E10004', msg: '토큰정보가 일치하지않습니다.' }

//code
constant.CODE_SERVICE_PROCESS_1 = '001'         // service process is done code 서비스로직 정상처리코드 1
constant.CODE_SERVICE_PROCESS_2 = '002'         // service process code 2       서비스로직 분기코드2
constant.CODE_SERVICE_PROCESS_3 = '003'         // service process code 3       서비스로직 분기코드3
constant.CODE_SERVICE_PROCESS_4 = '004'         // service process code 4       서비스로직 분기코드4
constant.CODE_SERVICE_PROCESS_5 = '005'         // service process code 5       서비스로직 분기코드5

//system someting wrong
constant.MSG_SYSTEM_ERROR = '서버에 문제가 발생하였습니다.'

//code
constant.CODE_SYSTEM_PROCESS_DONE = '0001'      // system process is done done  시스템로직 정상처리코드
constant.CODE_SYSTEM_PROCESS_ERROR = '9999'     // system process error code    시스템로직 예상치못한오류

module.exports = constant;
