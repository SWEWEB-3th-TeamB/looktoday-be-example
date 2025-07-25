import passport from 'passport';
import local from './localStrategy.js'; 
import { prisma } from '../../prisma/client.js'

export default () => {
    //serializeUser: 로그인 시 실행, req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드입니다.
    //매개변수로 user를 받고 나서 done 함수에 두 번째 인수로 user.id를 넘기고 있으며
    //매개변수 user가 어디서 오는지는 나중에 설명. 사용자 정보가 들어있다!
    //done함수의 첫 번째 인수 -> 에러 발생 시 사용
    //두 번째 인수 -> 저장하고 싶은 데이터를 넣는다. 로그인 시 사용자 데이터 세션에 저장하는데 사용자 정보 모두 세션에 저장 시 용량 커짐 
    //-> 아이디만 저장하라고 명령한 것.
    passport.serializeUser((user, done) => {
        done(null, user.id); // 세션에 user.id만 저장
    });
    
    //serializeUser와 다르게 각 요청마다 실행된다.
    //passport.sessoin 미들웨어가 이 메서드 호출.
    //serializeUser의 done의 두 번째 인수로 넣었던 데이터가 deserializeUser의 매개변수가 된다. 
      passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

    local(passport);
}