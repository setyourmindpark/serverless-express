## CONFIG SERVICE ENV
$ vi config/env.config.dev.js    
$ vi config/env.config.prod.js   
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
## CONFIG AWS KEYS
$ vi serverless/.env.yml
``` yml
credentials:
  accessKeyId: INPUT_YOUR_ACCESS_KEY_ID
  secretAccessKey: INPUT_YOUR_SECRET_ACCESS_KEY
```

## BUILD & DEPLOY
``` bash
$ cd serverless
$ npm build:dev     # dev mode [ webpack build only ]
$ npm build:prod    # prod mode [ webpack build only ]
$ npm deploy:dev    # dev mode [ webpack build and deploy ]
$ npm deploy:prod   # prod mode [ webpack build and deploy ]
```