const modules ={};

modules.initialize = ({ assistant, formatter, senderMail, senderAndorid },
                      { queryHelperModules, jwtModules }) => {   

    modules.assistant = assistant;
    modules.formatter = formatter;
    modules.senderMail = senderMail;
    modules.senderAndorid = senderAndorid;

    // modules.queryHelper = queryHelperModules.queryHelper1;
    modules.jwtAccess = jwtModules.jwtAccess;
    modules.jwtRefresh = jwtModules.jwtRefresh;
}

module.exports = modules;
