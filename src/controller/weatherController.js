import {
  getWeatherService,
  getWeatherServicewithCustomTime,
} from "../service/weatherService.js";
import { ApiResponse, CustomError } from "../response/index.js";

export const fetchWeather = async (req, res, next) => {
  try {
    const { sido, gungu } = req.query;

    if (!sido || !gungu) {
      throw new CustomError(
        "INVALID_LOCAION",
        "시도/군구 정보가 누락되었습니다."
      );
    }

    const result = await getWeatherService(sido, gungu);
    return res.status(200).json(
      ApiResponse.success({
        code: "WEATHER_FETCHED_SUCCESS",
        message: "날씨 정보 조회 성공",
        result,
      })
    );
  } catch (err) {
    next(err);
  }
};

export const fetchWeatherwithCustomTime = async (req, res, next) => {
  try {
    const { sido, gungu, date, time } = req.query;

    if (!sido || !gungu || !date || !time) {
      throw new CustomError(
        "INVALID_QUERY",
        "시도/군구/날짜/시간 정보가 누락되었습니다."
      );
    }

    const result = await getWeatherServicewithCustomTime(
      sido,
      gungu,
      date,
      time
    );

    return res.status(200).json(
      ApiResponse.success({
        code: "WEATHER_CUSTOM_TIME_FETCHED",
        message: "날짜+시간 기반 날씨 조회 성공",
        result,
      })
    );
  } catch (err) {
    next(err);
  }
}; //날짜, 시간을 프론트에서 받아오기
//이때 날짜는 yyyy-mm-dd형식이고 시간은   const baseHours = [2, 5, 8, 11, 14, 17, 20, 23 이 시간들 중 하나로 올 것
//예외처리랑 apiresponse는 위에 fetchWeather 구조와 동일하게 작성
//서비스에서는 받아온 날짜, 시간에 맞는 날씨정보만 보내기(앞뒤 시간 추가 날씨 정보 필요 없음)
