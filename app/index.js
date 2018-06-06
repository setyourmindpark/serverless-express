exports.initialize = initialize;

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const baseSenderMail = require('@root/base/sender/mail'); 
const baseSenderAndorid = require('@root/base/sender/android'); 
const baseAuthorizer = require('@root/base/authorizer'); 
const baseAssistant = require('@root/base/assistant'); 
const modules = require('@root/app/common/modules'); 
const toRouteRouters = require('@root/app/api'); 
const path = require('path');
const env = config.env;

function initialize() {
    initializeModule();
    return configureProtocol();
}

function initializeModule() {    
    
    const { jwtAccess, jwtRefresh } = baseAuthorizer.createModules();
    const basePlainModules = {
        assistant: baseAssistant,
        senderMail: baseSenderMail,
        senderAndorid: baseSenderAndorid
    };

    const baseModules = {             
        jwtModules: {
            jwtAccess: jwtAccess,
            jwtRefresh: jwtRefresh
        }
    }

    modules.initialize(basePlainModules, baseModules);
}

function configureProtocol() {
    //cross doamin handling
    app.use((req, res, next) => {
        if (req.originalUrl === '/favicon.ico') return;
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS ');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With,' +
            ' Content-Type, Accept,' +
            ' Authorization,' +
            ' Access-Control-Allow-Credentials'
        );
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(compression());
    app.use(helmet());
    app.use(cors());   

    const { routers, commonRoute } = toRouteRouters;
    routers.forEach(({ customRoute, toRoute, folder, router, activate }) => {
        if (activate) {
            const callRoute = customRoute ? customRoute : commonRoute + toRoute;
            app.use(callRoute, require('@root/app/api' + folder + router));
        }
    });

    app.use((req, res, next) => {
        res.status(404).send('404 not found');
    });

    return app;
}
