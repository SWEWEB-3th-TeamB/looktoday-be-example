//로그인 여부를 검사하는 express 미들웨어 함수들
export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    // 커스텀 에러 응답
    return res.status(403).json({
      isSuccess: false,
      code: 'AUTH_REQUIRED',
      message: '로그인이 필요합니다.',
      error: {},
    });
  }
};

export const isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    return res.status(400).json({
      isSuccess: false,
      code: 'ALREADY_LOGGED_IN',
      message: '이미 로그인된 상태입니다.',
      error: {},
    });
  }
};
