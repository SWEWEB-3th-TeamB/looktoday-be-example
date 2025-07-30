import { getWeatherService } from "../service/weatherService.js";
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
