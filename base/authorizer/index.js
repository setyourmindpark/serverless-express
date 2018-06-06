exports.createModules = createModules;

const jwt = require('./jwt');
const baseType = config.base.auth;

function createModules(){
    let jwtAccess = undefined;
    let jwtRefresh = undefined;

    if (baseType === 'jwt') {
        const jwtAccessConfig = config.setting.auth.jwt.access;
        const jwtRefreshConfig = config.setting.auth.jwt.refresh;
        jwtAccess = jwt.createModule(jwtAccessConfig);
        jwtRefresh = jwt.createModule(jwtRefreshConfig);    
    }
    return {
        jwtAccess: jwtAccess,
        jwtRefresh: jwtRefresh,
        // ..
    }
}
