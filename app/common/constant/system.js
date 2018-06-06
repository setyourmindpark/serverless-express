const constant = {};

// focus on db system constant
constant.USER_LINK_GENERAL = { code: 'user_link_general', group: 'user_link', name: '일반' };
constant.USER_LINK_FACEBOOK = { code: 'user_link_facebook', group: 'user_link', name: '페이스북' };
constant.USER_LINK_KAKAOTALK = { code: 'user_link_kakaotalk', group: 'user_link', name: '카카오톡' };
constant.USER_LINK_NAVER = { code: 'user_link_naver', group: 'user_link', name: '네이버' };

constant.USER_DEVICE_ANDROID = { code: 'user_device_android', group: 'user_device', name: '안드로이드' };
constant.USER_DEVICE_IOS = { code: 'user_device_ios', group: 'user_device', name: '아이폰' };

constant.FILE_TARGET_LOCAL = { code: 'file_target_local', group: 'file_target', name: '로컬' };
constant.FILE_TARGET_S3 = { code: 'file_target_s3', group: 'file_target', name: '아마존 s3' };


// etc ..

module.exports = constant;