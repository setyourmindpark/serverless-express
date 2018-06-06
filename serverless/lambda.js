const awsServerlessExpress = require('aws-serverless-express');

exports.devHandler = (event, context) => {
    const devBundle = require('./build/dev.bundle')();
    const server = awsServerlessExpress.createServer(devBundle);
    return awsServerlessExpress.proxy(server, event, context);
}

exports.prodHandler = (event, context) => {
    const prodBundle = require('./build/prod.bundle')();
    const server = awsServerlessExpress.createServer(prodBundle);
    return awsServerlessExpress.proxy(server, event, context);
}
