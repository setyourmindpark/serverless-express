## NODEJS-API-SERVER-BOILERPLATE
NODEJS-API-SERVER-BOILERPLATE를 목표로 개발중이다.   
전체적인 프로젝트구조는 모듈을 위한 **/base** 그리고 서비스 비지니스로직 처리에대한 **/app** 로 구조화하였으며  
**/base**가 제공하는 기능은 다음과같다. **( /app/index 에서 /app/common/modules/에 base modules를 binding )**   

### assistant  
- parameter validator 
- file uploader ( local, s3 )

### authorizer  
- jsonwebtoken

### logger  
- local
- fluentd

### sender  
- mail
- android

### sequelize  

### queryHelper  
- queryHelper보다는 sequelize를 사용하는게.. 

---

## 환경변수
boilerplate는 환경변수기반으로 동작하며  **env.config.dev**와 **env.config.prod**로 작성될수있으며 **/config/** 에 위치한다.  
 **/.env**의 설정값에따라 작성된 **env.config.dev** 또는 **env.config.prod**로 동작한다.  
``` javascript

module.exports = {
    env: '',
    base: {
        port: '',
        logger: '',
        db: '',
        auth: '',
    },
    setting: {
        upload: {
            local: {                
                assetDir: '',
                saveDir: '',
            },
            s3: {
                accessKeyId: '',
                secretAccessKey: '',
                bucket: '',
            }
        },
        auth: {
            jwt: {
                access: {
                    algorithm: '',
                    param: '',
                    secret: '',
                    expire: '',
                },
                refresh: {
                    algorithm: '',
                    param: '',
                    secret: '',
                    expire: '',
                }
            },

        },
        db: {
            mysql: {
                host: '',
                port: '',
                user: '',
                database: '',
                password: '',
                connectionLimit: '',
                connectionLeast: '',
            },

        },
        sender: {
            mail: {
                service: '',
                user: '',
                passwd: '',
                from: '',
            },
            android: {
                serverKey: '',
            },
            ios: {

            }
        },
        logger: {
            local: {
                level: '',
                dir: '',
                fileName: '',
                timestamp: '',
            },
            fluentd: {
                level: '',
                host: '',
                port: '',
                timeout: '',
                tag: '',
            }

        }
    }
}
```

### deprecated
``` bash

@ deprecated
BASE_PORT=( base로 사용할 port ex. 4000 ) 
BASE_LOGGER= ( base로 사용할 autorizer ex. local ) 
BASE_DB= ( base로 사용할 database type ex. mysql [ 현재는 mysql만 존재.. ] ) 
BASE_AUTH= ( base로 사용할 autorizer ex. jwt [ 현재는 jwt만 존재.. ] ) 

BASE_LINK_DB_SOMETHING=..

UPLOAD_LOCAL_MAIN_DIR_PATH= ( 파일업로드 처리 경로 ex. /app/public/upload )

S3_ACCESS_KEY_ID= ( aws에서 발급반은 access key )
S3_SECRET_ACCESS_KEY= ( aws에서 발급반은 secret access key )
S3_BUCKET= ( s3 버킷명 )

AUTH_JWT_ACCESS_ALGORITHM= ( 암호화 알고리즘 ex. HS256 )
AUTH_JWT_ACCESS_PARAM= ( header 명 ex. header1 )
AUTH_JWT_ACCESS_SECRET= ( ex. secret1 )
AUTH_JWT_ACCESS_EXPIRE= ( 토큰 발행후 만료시간(초) ex. 600 )

AUTH_JWT_REFRESH_ALGORITHM= ( 암호화 알고리즘 ex. HS256 )
AUTH_JWT_REFRESH_PARAM= ( header 명 ex. header2 )
AUTH_JWT_REFRESH_SECRET= ( ex. secret2 )
AUTH_JWT_REFRESH_EXPIRE= ( 토큰 발행후 만료시간(초) ex. 6000 )

DB_MYSQL_HOST= ( ex. localhost )
DB_MYSQL_PORT= ( ex. 3306 )
DB_MYSQL_USER= ( database 계정 )
DB_MYSQL_DATABASE= ( ex. database )
DB_MYSQL_PASSWORD= ( database 계정 비밀번호 )
DB_MYSQL_CONNECTION_LIMIT= ( ex. 200 )
DB_MYSQL_CONNECTION_LEAST= ( ex. 10 )

SENDER_MAIL_SERVICE= ( ex. gmail )
SENDER_MAIL_ID= ( ex. user@gmail.com )
SENDER_MAIL_PASSWD= ( ex. 계정 비밀번호 )
SENDER_MAIL_FROM=mail_from ( 발신인 ex. jaehunpark<setyourmindpark@gmail.com> )

SENDER_ANDROID_SERVER_KEY= ( fcm에서 발급받은 server key )

LOGGER_LOCAL_LEVEL= ( local log level ex. debug )
LOGGER_LOCAL_FILE_PATH= ( local log file path ex. /some/where )
LOGGER_LOCAL_FILE_NAME= ( local log file name ex. /app.log )

LOGGER_FLUENTD_LEVEL=fluentd_log_level ( local log level ex. debug )
LOGGER_FLUENTD_HOST= ( ex. localhost )
LOGGER_FLUENTD_PORT= ( ex. 24224 )
LOGGER_FLUENTD_TIMEOUT= ( ex. 3 )
LOGGER_FLUENTD_TAG= ( ex. app )

```


---

## asisstant
기본적으로 설정 방법은 다음과같다.  
미들웨어기반으로 동작하기에 express 미들웨어로 작성한다.  
### basic
``` javascript
const regExpEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
assistant.validate({
        params: {                                               // => params는 default require: true ( url path로 넘어오기에 .. )
            param1: { v_type: 'any' },                          // => param1 파라미터는 값은 아무값이나 상관없음
            param2: { v_type: 'onlyNum' },                      // => param1 파라미터는 값은 오직 숫자만 가능 ex. '12345' O, 'some1' X
            param3: { v_type: 'onlyChar' },                     // => param1 파라미터는 값은 오직 문자만 가능 ex. 'something' O, 'some1' X
            param4: { v_type: regExpEmail }                     // => param1 파라미터는 값은 오직 정규식( regExpEmail ) 형태만 가능
        },
        query: {                                                // => querystring
            query1: { require: true, v_type:'any' }             // query1 파라미터는 필수이며 값은 아무값이나 상관없음
            // ...
        },
        body: {
            body1: { require: true, v_type:'any' }
        }
    }, message.customMessage())
```
assistant.validator의 2번째인자값의 callback function은 명시하지않으면 default로 /base/common/constant 기반으로 동작한다.  
custom하게 error response handling시 위와같이 작성한다. ( /app/common/message 참고 )  

### local file upload
``` javascript
// [ allowExt ]
// ['jpg', 'bmp'] => .jpg, .bmp 만허용
// 'any' 모든파일 확장자 가능 .

// [ uptoSize ]
// b for bytes
// kb for kilobytes
// mb for megabytes
// gb for gigabytes
// tb for terabytes
// 'any' max 용량체크안함 .

// [ subDir ] 
// [today] 는 현재날짜로 폴더를 생성하게됨. 
assistant.validate({
    multipart: {
        files: {
            fileFeild1: { require: true, allowExt: ['jpg', 'bmp'], uptoSize: '20mb', upload: { target: 'local', subDir: '/[today]/files', thumbnail: { width: 100, height: 200, subDir: '/[today]/thumbnails' } } },
            fileFeild2: { require: false, allowExt: 'any', uptoSize: 'any', upload: { target: 'local', subDir: '/[today]/files' } }
        },
        fields: {
            bodyFeild1: { require: true, v_type: regExpEmail },
            bodyFeild2: { require: false, v_type: 'any' }
        }
    }
}, message.customMessage() )
```
### s3 file upload
``` javascript
// s3에 bucket은 반드시 생성하고 사용할것.
// 버킷/폴더/폴더/....
// 폴더생성은 자동으로 생성됨 .
assistant.validate({
    multipart: {
        files: {
            fileFeild1: { require: true, allowExt: 'any', uptoSize: '20mb', upload: { target: 's3', subDir: '/[today]/files', thumbnail: { width: 300, height: 300, subDir: '/[today]/thumbnails' } } },
            fileFeild2: { require: true, allowExt: 'any', uptoSize: '20mb', upload: { target: 's3', subDir: '/[today]/files' } },
        },
        fields: {
            bodyFeild1: { require: false, v_type: regExpEmail },
            bodyFeild2: { require: false, v_type: 'any' }
        }
    }
}, message.customMessage())
```

---

## router
router 등록은 다음과같이 설정할수있다.  
/app/api에 폴더별 router를 생성하며 적용은 /app/api/index.js에서 설정한다.  
``` javascript
const env = config.env;
commonRoute : '/api',                                   // => default 첫번쨰 endpoint로 시작 /api
    routers : [
        {
            toRoute: '/sample',                         // => endpoint는 /api/sample
            folder: '/sample',
            router: '/router.js',
            activate: env === 'dev' ? true : false
        },        
        {
            toRoute: '/user',                           // => endpoint는 /api/user
            folder: '/user',
            router: '/router.js',
            activate: true
        },

        // ..
    ]
```
해당 format으로 /app/index.js에서 자동으로 express api 등록된다.  

---

## sequelize
**/app/query/sequelize/design/models**에 **sequelize model**을 정의하고   
**/app/query/sequelize/design/index.js**에 **bind**와 **associations** 정의한다.
### force sync
개발 시작 단계에서 database table DDL 또는 DML 초기화 sync는 /app/query/sequelize/force.js 를 이용한다.  
force.js 를 실행하는 명령어는 다음과같다.  
**=> /app/query/sequelize/design 에 model 정의와 /app/query/sequelize/index.js association 정의 후**  
``` bash
$ yarn init-ddl
or
$ npm run init-ddl

$ yarn init-ddl
yarn run v1.5.1
$ sudo node ./app/query/sequelize/force.js --dev
Password:
###################### [ 경고 ] 반드시 DDL 생성과 초기화 작업이 필요한경우에만 수행해주세요 ######################
######################  sequelize를 사용하여 테이블을 생성및 초기화를 진행하시겠습니까 ?  yes or no ######################
prompt: yesorno:  yes
```
혹시나 해당명령어를 실수로라도 입력하는것을 방지하기위해 root 권한으로 실행해야 하며 초기화 여부를 yes or no 로 답한다.  
해당명령어는 운영모드에서는 절대 사용하지말아야하며 ( 모든데이터를 초기화한다 ) 운영모드시 force.js를 삭제하는것을 권고한다.  

---

## 실행
실행은 cluster 모듈을 사용하여 cpu 논리코어 갯수만큼 worker가 생성된다.  
``` bash
$ yarn start
or
$ npm start

info: created worker [ 35558 ] is listening port : 4000
info: created worker [ 35557 ] is listening port : 4000
info: created worker [ 35559 ] is listening port : 4000
info: created worker [ 35560 ] is listening port : 4000
```

---

## webpack build
``` bash
$ npm run build:dev
$ npm run build:prod
```




