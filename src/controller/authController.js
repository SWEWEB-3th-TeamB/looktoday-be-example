// src/controller/authController.js

import { signupService } from '../service/userService.js';
import { ApiResponse, CustomError } from '../response/index.js';
import passport from 'passport';

export const signup = async (req, res, next) => {
  const { email, password, nickname, sido, gungu } = req.body;

  try {
    const result = await signupService({ email, password, nickname, sido, gungu });

    return res.status(201).json(
      ApiResponse.success({
        code: 'USER_CREATED',
        message: '회원가입 완료',
        result,
      })
    );
  } catch (err) {
    if (err instanceof CustomError) {
      return res.status(400).json(
        ApiResponse.fail({
          code: err.code,
          message: err.message,
          error: err.error,
        })
      );
    }

    return next(err); // 시스템 예외 처리
  }
};



export const login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError); // 시스템 에러
    }

    if (!user) {
      // 로그인 실패: info.message 사용
      return res.status(401).json(ApiResponse.fail({
        code: 'LOGIN_FAILED',
        message: info.message,
        error: {},
      }));
    }

    // 로그인 성공 처리
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError); // 시스템 에러
      }

      return res.status(200).json(ApiResponse.success({
        code: 'LOGIN_SUCCESS',
        message: '로그인 성공',
        result: { email: user.email, nickname: user.nickname },
      }));
    });
  })(req, res, next);
};