
exports.send = send;

const nodemailer = require('nodemailer');
const { service, user, passwd, from } = config.setting.sender.mail;
const sender = nodemailer.createTransport({
    service: service,
    auth: {
        user: user,
        pass: passwd
    }
});

// Promise.all 과 같은 동시다발적 비동기처리중 메일전송이 특정 수신인에게 실패하더라도 중단하면 안되기때문에 메일 전송 결과값만을 return
// async await을 사용할수도있으나 메일실패시 바로 throw err가 되기때문에( 실패와무관하게 결과값만 저장 ) promise를 수동으로 사용함. 
function send({ to, subject, text, html }){
    return new Promise(( resolve, reject ) => {
        const options = { from: from, to: to, subject: subject };
        if (text) options.text = text;
        else if (html) options.html = html;
        else if (attachments) options.attachments = attachments;

        sender.sendMail(options, ( error, response ) => {
            let sended = true;
            if (error) sended = false;
            
            resolve({
                sended: sended,
                mail: to
            })
            sender.close();     
        });        
    })
    
}
