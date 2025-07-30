//응답 포맷 통일 클래스 입니다.
//서비스에서 성공 or 실패 시 이 클래스를 사용해서 일관된 형태로 반환
import { CustomSuccess } from "./CustomSuccess.js";
import { CustomError } from "./CustomError.js";

export class ApiResponse {
  static success({
    code = "COMMON200",
    message = "요청에 성공했습니다.",
    result = {},
  }) {
    return new CustomSuccess(code, message, result);
  }

  static fail({
    code = "COMMON400",
    message = "요청에 실패했습니다.",
    error = {},
  }) {
    return new CustomError(code, message, error);
  }
}
