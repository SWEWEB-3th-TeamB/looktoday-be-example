//src/response/CustomSuccess.js
export class CustomSuccess {
  constructor(code = 'COMMON200', message = '요청에 성공했습니다.', result = {}) {
    this.isSuccess = true;
    this.code = code;
    this.message = message;
    this.result = result;
  }
}
