// src/service/authService.js
import { findUserByEmail, createUser } from '../repository/userRepository.js';
import { CustomError } from '../response/CustomError.js';
import bcrypt from 'bcrypt';

export const signupService = async ({ email, password, nickname, sido, gungu }) => {
  const exUser = await findUserByEmail(email);
  if (exUser) {
    throw new CustomError('USER_EXISTS', '이미 존재하는 이메일입니다.', { email });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUser({
    email,
    password: hashedPassword,
    nickname,
    sido,
    gungu,
  });

  return {
    email: user.email,
    nickname: user.nickname,
  };
};
