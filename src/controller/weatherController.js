import {
  getWeatherService,
  getAsosObservedAt,
} from "../service/weatherService.js";
import { ApiResponse, CustomError } from "../response/index.js";

export const fetchWeatherwithCustomTime = async (req, res, next) => {
  try {
    const { sido, gungu } = req.query;
    if (!sido || !gungu) {
      throw new CustomError("INVALID_QUERY", "시도/군구는 필수입니다.");
    }

    const result = await getWeatherService(sido, gungu);

    return res.status(200).json(
      ApiResponse.success({
        code: "WEATHER_CUSTOM_TIME_FETCHED",
        message: "날짜+시간 자동 계산 날씨 조회 성공",
        result,
      })
    );
  } catch (err) {
    if (err instanceof CustomError) {
      return res.status(400).json(
        ApiResponse.fail({
          code: err.code,
          message: err.message,
          error: err.error ?? {},
        })
      );
    }
    next(err);
  }
};
//날짜, 시간을 프론트에서 받아오기
//이때 날짜는 yyyy-mm-dd형식이고 시간은   const baseHours = [2, 5, 8, 11, 14, 17, 20, 23 이 시간들 중 하나로 올 것
//예외처리랑 apiresponse는 위에 fetchWeather 구조와 동일하게 작성
//서비스에서는 받아온 날짜, 시간에 맞는 날씨정보만 보내기(앞뒤 시간 추가 날씨 정보 필요 없음)

//시도/군구 받아와서 관측소 선택 후 날씨 api호출 결과
export const fetchLooktodayWeather = async (req, res, next) => {
  try {
    const { sido, gungu, date, hour } = req.query; // date(YYYY-MM-DD|YYYYMMDD), hour(HH) 옵션
    if (!sido || !gungu) {
      throw new CustomError("INVALID_QUERY", "시도/군구는 필수입니다.");
    }

    const result = await getAsosObservedAt(sido, gungu, date, hour);

    return res.status(200).json(
      ApiResponse.success({
        code: "ASOS_OBS_FETCHED",
        message: "ASOS 관측 기반 날씨 조회 성공",
        result,
      })
    );
  } catch (err) {
    if (err instanceof CustomError) {
      return res.status(400).json(
        ApiResponse.fail({
          code: err.code,
          message: err.message,
          error: err.error ?? {},
        })
      );
    }
    next(err);
  }
};
