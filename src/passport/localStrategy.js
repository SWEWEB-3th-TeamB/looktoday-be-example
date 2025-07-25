import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { findUserByEmail } from '../repository/userRepository.js';

export default (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',  // req.body.email 사용
    passwordField: 'password',  // req.body.password 사용
    session: true,  // 세션 사용 여부 (true면 req.login()으로 세션 저장됨)
  },
  async (email, password, done) => {
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        return done(null, false, { message: '존재하지 않는 이메일입니다.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
      }

      return done(null, user);
    } catch (error) {
      console.error(error);
      return done(error);
    }
  }));
};
