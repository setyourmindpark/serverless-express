const modules ={};

modules.initialize = ({ assistant, formatter, senderMail, senderAndorid },
                      { jwtModules }) => {   

    modules.assistant = assistant;
    modules.formatter = formatter;
    modules.senderMail = senderMail;
    modules.senderAndorid = senderAndorid;

    modules.jwtAccess = jwtModules.jwtAccess;
    modules.jwtRefresh = jwtModules.jwtRefresh;
}

module.exports = modules;
