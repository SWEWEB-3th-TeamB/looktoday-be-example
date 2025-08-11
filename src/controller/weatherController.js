import {
  getWeatherService,
  getUltraNowcastService

} from "../service/weatherService.js";
import { ApiResponse, CustomError } from "../response/index.js";

/*
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
        message: "초단기 실황 조회 성공",
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
*/


//날짜, 시간을 프론트에서 받아오기
//이때 날짜는 yyyy-mm-dd형식이고 시간은   const baseHours = [2, 5, 8, 11, 14, 17, 20, 23 이 시간들 중 하나로 올 것
//예외처리랑 apiresponse는 위에 fetchWeather 구조와 동일하게 작성
//서비스에서는 받아온 날짜, 시간에 맞는 날씨정보만 보내기(앞뒤 시간 추가 날씨 정보 필요 없음)


//현재 시간
export const fetchUltraNowcast = async (req, res, next) => {
  try {
    const { sido, gungu } = req.query;
    if (!sido || !gungu) {
      throw new CustomError("INVALID_QUERY", "시도/군구는 필수입니다.");
    }

    const result = await getUltraNowcastService(sido, gungu);

    return res.status(200).json(
      ApiResponse.success({
        code: "WEATHER_NCST_FETCHED",
        message: "초단기 실황 조회 성공",
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


//과거 시간
export const fetchUltraNowcastAt = async (req, res, next) => {
  try {
    const { sido, gungu, date, time } = req.query; // date: yyyy-mm-dd, time: HHmm(10분 단위)
    if (!sido || !gungu || !date || !time) {
      throw new CustomError("INVALID_QUERY", "sido, gungu, date, time은 필수입니다.");
    }
    if (!/^\d{2}\d{2}$/.test(time) || Number(time.slice(2)) % 10 !== 0) {
      throw new CustomError("INVALID_TIME", "time은 HHmm 10분 단위여야 합니다.");
    }

    const result = await getUltraNowcastService(sido, gungu, { date, time });

    return res.status(200).json(
      ApiResponse.success({
        code: "WEATHER_NCST_AT_FETCHED",
        message: "지정 시각 초단기 실황 조회 성공",
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
