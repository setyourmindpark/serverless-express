
exports.createModule = createModule;

const constant = require('@root/base/common/constant');
const jwt = require('jsonwebtoken');
const formatter = require('@root/base/common/formatter');

// passport를 더이상쓰지않음. api server 로만쓸것이기때문에 session관련사항은 불필요함. 
// jsonwebtoken 모듈로두 충분히 access token과 refresh token을 구현할수있음. verify 만 하면됨..
// 해당 모듈을 n 개생성할수있도록 초기화하여 생성함. jwt 설정값에따라 같은비지니스로직이 쓰일수있음
function createModule({ secret, algorithm, expire, param }) {
    const jwtModule =  {
        // customHandleFunction validate 수행결과를 callback으로 router( 호출시점 ) 에서 받을시 정의하여 사용. callback으로 보내줌.( middleware, validate result )
        // customHandleFunction default는 base formatter에서 바로 response를 validate code와 message를 response 함.
        isAuthenticated: (customHandleFunction) => {
            return (req, res, next) => {
                try {
                    const token = req.headers[param];
                    if (!token) {
                        const jwtError = new Error(constant.JWT_EMPTY_TOKEN.msg);
                        jwtError.errorCode = constant.JWT_EMPTY_TOKEN.code;
                        throw jwtError;
                    }
                    try {
                        req.user = jwt.verify(token, secret);                        
                        next();
                    } catch (err) {
                        if (err.name === 'TokenExpiredError') {
                            const jwtError = new Error(constant.JWT_EXPIRE_TOKEN.msg);
                            jwtError.errorCode = constant.JWT_EXPIRE_TOKEN.code;
                            throw jwtError;
                        } else if (err.name === 'JsonWebTokenError') {
                            const jwtError = new Error(constant.JWT_INVALID_TOKEN.msg);
                            jwtError.errorCode = constant.JWT_INVALID_TOKEN.code;
                            throw jwtError;
                        }
                        throw err;
                    }

                } catch ({ errorCode, message }) {
                    if (customHandleFunction) {
                        customHandleFunction(
                            { req, res, next },
                            { code: errorCode, msg: message }
                        )
                    } else {
                        res.send(formatter.apiResponse({ resultCode: errorCode, msg: message }))                        
                    }
                }
            }
        },
        decode : (token) => {
            try{
                return jwt.decode(token);
            }catch(err){
                const jwtError = new Error(constant.JWT_INVALID_TOKEN.msg);
                jwtError.errorCode = constant.JWT_INVALID_TOKEN.code;
                throw jwtError;
            }            
        },
        generateToken: (tokenBody) => {
            const token = jwt.sign(tokenBody, secret, {
                algorithm: algorithm,
                expiresIn: parseInt(expire)
            })
            return token;
        }
    }
    return jwtModule;
}

//https://blog.jscrambler.com/implementing-jwt-using-passport/
// iss: 토큰을 발급한 발급자(Issuer)
// sub: Claim의 주제(Subject)로 토큰이 갖는 문맥을 의미한다.
// aud: 이 토큰을 사용할 수신자(Audience)
// exp: 만료시간(Expiration Time)은 만료시간이 지난 토큰은 거절해야 한다.
// nbf: Not Before의 의미로 이 시간 이전에는 토큰을 처리하지 않아야 함을 의미한다.
// iat: 토큰이 발급된 시간(Issued At)
// jti: JWT ID로 토큰에 대한 식별자이다.
//jwt.sign({ foo: 'bar' }, 'secret', { algorithm: 'HS256'});
