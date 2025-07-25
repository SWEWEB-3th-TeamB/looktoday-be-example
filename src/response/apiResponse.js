//응답 포맷 통일 클래스 입니다.
import { CustomSuccess } from './CustomSuccess.js';
import { CustomError } from './CustomError.js';

export class ApiResponse {
  static success({ code = 'COMMON200', message = '요청에 성공했습니다.', result = {} }) {
    return new CustomSuccess(code, message, result);
  }

  static fail({ code = 'COMMON400', message = '요청에 실패했습니다.', error = {} }) {
    return new CustomError(code, message, error);
  }
}
