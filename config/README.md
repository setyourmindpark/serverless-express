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