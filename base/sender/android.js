exports.send = send;

const { serverKey } = config.setting.sender.android;
const FCM = require('fcm-push');
const sender = new FCM( serverKey || 'emptyServerKey' );

// Promise.all 과 같은 동시다발적 비동기처리중 메일전송이 특정 수신인에게 실패하더라도 중단하면 안되기때문에 메일 전송 결과값만을 return
// async await을 사용할수도있으나 메일실패시 바로 throw err가 되기때문에( 실패와무관하게 결과값만 저장 ) promise를 수동으로 사용함. 
function send({ to, title, body }) {
    return new Promise((resolve, reject) => {
        const options = {
            to: to,                                     // 수신대상        
            notification: {                             // App이 실행중이지 않을 때 상태바 알림으로 등록할 내용
                title: title,
                body: body,
                // sound: 'default',
                // click_action: 'FCM_PLUGIN_ACTIVITY',
                // icon: 'fcm_push_icon'
            },
            priority: 'high',                           // 메시지 중요도                        
            data: {                                     // 실행중일때 App에게 전달할 데이터
                title: title,
                body: body
            }
        };

        sender.send(options, (error, response) => {
            let sended = true;
            if (error) sended = false;
            
            resolve({
                sended: sended,
                token: to
            });
        });
    })
}