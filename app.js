import express from 'express';
import session from 'express-session';
import passport from 'passport';

import { CustomError } from './src/response/CustomError.js';
import { ApiResponse } from './src/response/apiResponse.js';
import authRouter from './src/routes/auth.js'; // default export로 가정
import passportConfig from './src/passport/index.js';

const app = express(); //express 객체 생성
passportConfig();
//환경변수에 PORT가 있으면 그거 사용하기, 없으면 3000을 port에 넣어주기
//여기서 set은 express앱의 설정 값을 저장할 때 사용하는 함수이다.
app.set('port', process.env.PORT || 3000); 



//ㅎgptgpt
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ 3. 세션/패스포트 미들웨어 설정
app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ 4. auth 라우터 연결
app.use('/', authRouter); // 이제 /signup, /login 인식됨!

//gptgpt




//get은 용도가 두개
// 1. app.set으로 저장한 설정 값을 가져오는 함수이다.
//2. app.get('경로', 핸들러) 브라우저가 URL로 GET 요청을 보낼 때 어떻게 응답할지 정의하는 것


// 예시 라우트: 테스트 에러 발생용
app.get('/error-test', (req, res, next) => {
  // 예: 로그인 상태 아님
  const err = new CustomError('AUTH401', '로그인 상태가 아닙니다.', { route: '/error-test' });
  next(err); // 전역 에러 핸들러로 전달
});


//전역 에러 핸들러
app.use((err, req, res, next) =>{
    console.error(err);

    //응답 헤더가 이미 전송된 경우 무시
    if(res.headersSent){
        return next(err);
    }

    //CustomError인 경우 -> 커스텀 포맷으로 응답
    if(err instanceof CustomError){
        return res.status(400).json(
            ApiResponse.fail({
                code:err.code,

            })
        )
    }

    return res.status(500).json(
        ApiResponse.fail({
            code: 'INTERNAL_SERVER_ERROR',
            message: '서버 내부 오류입니다.',
        })
    )
})


//위에서 설정한 포트 번호로 서버 실행
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});