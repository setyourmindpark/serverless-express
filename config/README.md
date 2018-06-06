현재폴더( config )  

- env.config.dev.js
- env.config.prod.js

다음과같이 작성한다.  
webpack build시 해당 경로의 환경변수를 읽어온다.  
``` javascript
module.exports = {
    mode: '',
    base: {
        port: '',
        db: [],
        auth: '',
    },
    setting: {
        logger: {
            level: '',
        },
        upload: {            
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
    }
}
```