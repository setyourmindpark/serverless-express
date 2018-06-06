
global.config = buildEnv;
global.logger = require('@root/base/logger').getLogger();
const app = require('@root/app');

module.exports = () => app.initialize();