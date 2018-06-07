const { assistant } = require('@root/app/common/modules');
const message = require('@root/app/common/message');
const router = require('express').Router();
const sampleController = require('./controller');
const regExpEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

router.get(
    '/hello',
    sampleController.hello()
);

//get 방식의 고전 querystring 방식 지원하기위해 예제를 작성함. query, post 의 body validate format과 같음
router.get(
    '/query',
    assistant.validate({
        query: {
            param1: { require: true, v_type: 'any' },
            param2: { require: true, v_type: 'onlyNum' },
            param3: { require: true, v_type: 'onlyChar' },
            param4: { require: true, v_type: regExpEmail }
        }
    }, message.customMessage() ),
    assistant.unifyAllProps(),
    sampleController.query()
);

router.post(
    '/post',
    assistant.validate({
        body: {
            param1: { require: true, v_type: 'any' },
            param2: { require: true, v_type: 'onlyNum' },
            param3: { require: false, v_type: 'onlyChar' }
        }
    }, message.customMessage() ),
    assistant.unifyAllProps(),
    sampleController.post()
);

router.put(
    '/put/:where',
    assistant.validate({
        params: {
            where: { v_type: 'onlyNum' }
        },
        body: {
            param1: { require: true, v_type: 'onlyChar' },
            param2: { require: true, v_type: 'any' },
            param3: { require: false, v_type: 'any' }
        }
    }, message.customMessage() ),
    assistant.unifyAllProps(),
    sampleController.put()
);

router.delete(
    '/delete/:where',
    assistant.validate({
        params: {
            where: { v_type: 'onlyNum' }
        }
    }, message.customMessage() ),
    assistant.unifyAllProps(),
    sampleController.delete()
);

//https://www.npmjs.com/package/bytes
// support  b for bytes
//          kb for kilobytes
//          mb for megabytes
//          gb for gigabytes
//          tb for terabytes
//          'any' max 용량체크안함 .
// s3 업로드 예제
// bucket이 aws에 존재하지않을시 서버에러.
// 상황에따라 s3 버킷을 조회하고 생성하는 로직을 추가로 작성할것임.
// 현재 생성된 버킷에 업로드만 가능.
// 버킷/폴더/폴더/....
// 폴더생성은 자동으로 생성됨 .
// router.post(
//     '/s3Upload',
//     assistant.validate({
//         multipart: {
//             files: {
//                 fileFeild1: { require: true, allowExt: 'any', uptoSize: '20mb', upload: { target: 's3', subDir: '/[today]/files', thumbnail: { width: 300, height: 300, subDir: '/[today]/thumbnails' } } },
//                 fileFeild2: { require: true, allowExt: 'any', uptoSize: '20mb', upload: { target: 's3', subDir: '/[today]/files' } },
//             },
//             fields: {
//                 bodyFeild1: { require: false, v_type: regExpEmail },
//                 bodyFeild2: { require: false, v_type: 'any' }
//             }
//         }
//     }, message.customMessage()),
//     assistant.unifyAllProps(),
//     sampleController.s3Upload()
// );

module.exports = router;
