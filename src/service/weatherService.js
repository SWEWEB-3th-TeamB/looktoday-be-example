//기상청_단기예보 ((구)_동네예보) 조회서비스 API불러오기

import axios from "axios";
import { getCoordinates } from "../utils/locationMapper.js";
import { CustomError } from "../response/index.js";
import { translateCategory } from "../utils/weatherCategoryMapper.js";

// 기상청 단기예보 API 설정 (예: 실시간 초단기 예보)
const WEATHER_API_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const FORECAST_SERVICE_KEY = process.env.WEATHER_API_KEY;

/*
//오늘의 날씨 - 날씨 예보 정보
export const getWeatherService = async (sido, gungu) => {
  //1.시도 + 군구 로 nx, ny 좌표 조회
  const coords = getCoordinates(sido, gungu);
  if (!coords) {
    throw new CustomError("LOCATION_NOT_FOUND", "유효하지 않은 지역입니다.");
  }

  const { nx, ny } = coords;

  //2. 날짜/시간 계산 (base_date, base_time)
  const now = new Date();
  const yyyyMMdd = now.toISOString().split("T")[0].replace(/-/g, "");
  const baseTime = calculateBaseTime(now); // 예: "0500", "1100" 등

  // 3. API 요청 파라미터 구성
  const queryString = new URLSearchParams({
    serviceKey: FORECAST_SERVICE_KEY, // 인코딩된 키여야 함
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: yyyyMMdd,
    base_time: baseTime,
    nx,
    ny,
  }).toString();

  const url = `${WEATHER_API_URL}?${queryString}`;

  // 4. axios로 날씨 API 요청
  try {
    const response = await axios.get(url);
    console.log("날씨 응답 확인:", response.data);
    const body = response?.data?.response?.body;

    if (!body || !body.items || !body.items.item) {
      throw new CustomError("WEATHER_API_FAILED", "날씨 정보가 없습니다.");
    }

    const items = body.items.item;

    //아래 targetHour, filteredItems 추가로 보낸 시간에 대한 날씨 정보만 가져오기
    //원하는 시점: baseTime + 1시간

    const targetHour =
      String(Number(baseTime.slice(0, 2)) + 1).padStart(2, "0") + "00";

    //날짜와 시간으로 필터링
    const filteredItems = items.filter(
      (item) => item.fcstDate === yyyyMMdd && item.fcstTime === targetHour
    );

    //여기까지!
    if (!filteredItems.length) {
      throw new CustomError(
        "WEATHER_NOT_FOUND",
        "해당 시각의 예보가 없습니다."
      );
    }

    // 공통 메타(모든 항목 동일)
    const meta = {
      baseDate: filteredItems[0].baseDate,
      baseTime: filteredItems[0].baseTime,
      fcstDate: filteredItems[0].fcstDate,
      fcstTime: filteredItems[0].fcstTime,
    };

    // weather 간소화: 카테고리/값만
    const weather = filteredItems.reduce((acc, it) => {
      acc[translateCategory(it.category)] = isNaN(it.fcstValue)
        ? it.fcstValue // 숫자가 아니면 그대로
        : Number(it.fcstValue); // 숫자면 숫자로 변환
      return acc;
    }, {});

    return {
      date: yyyyMMdd, // 호출 기준 날짜(YYYYMMDD)
      ...meta, // baseDate/baseTime/fcstDate/fcstTime
      location: { sido, gungu, nx, ny },
      weather, // 간소화된 배열
    };
  } catch (err) {
    console.error("Weather API Error:", err.message);
    throw new CustomError("WEATHER_API_FAILED", "날씨 정보 조회 실패");
  }
};

// 기상청 단기예보 base_time 계산 (정각 기준으로 가장 가까운 시간대)
function calculateBaseTime(date) {
  const hour = date.getHours();
  const minute = date.getMinutes();

  const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];

  // 현재 시각에서 가장 가까운 base_time 찾기
  let closest = baseHours[0];
  for (let i = 0; i < baseHours.length; i++) {
    if (hour < baseHours[i]) break;
    closest = baseHours[i];
  }

  return (closest < 10 ? "0" + closest : "" + closest) + "00";
}



*/

//초단기 실황 조회

const ULTRA_NCST_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
const SERVICE_KEY = process.env.WEATHER_API_KEY;

// 초단기 실황 조회
// opts: { date: 'yyyy-mm-dd', time: 'HHmm' } (옵션: 없으면 현재시각 기준 자동 계산)
export const getUltraNowcastService = async (sido, gungu, opts = {}) => {
  // 1) 좌표
  const coords = getCoordinates(sido, gungu);
  if (!coords) {
    throw new CustomError("LOCATION_NOT_FOUND", "유효하지 않은 지역입니다.");
  }
  const { nx, ny } = coords;

  // 2) base_date/base_time 결정
  let baseDate, baseTime;
  if (opts.date && opts.time) {
    baseDate = opts.date.replace(/-/g, ""); // yyyyMMdd
    baseTime = opts.time; // HHmm (10분 단위)
  } else {
    ({ baseDate, baseTime } = calculateUltraNcstBase(new Date()));
  }

  // 3) 요청
  const query = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx,
    ny,
  }).toString();

  const url = `${ULTRA_NCST_URL}?${query}`;

  try {
    const { data } = await axios.get(url);
    const body = data?.response?.body;
    const items = body?.items?.item;
    if (!items || !items.length) {
      // 실황은 시계열이 조밀해서, 없다면 10분씩 한두 번만 되감아 재시도하는 것도 방법
      throw new CustomError(
        "WEATHER_NOT_FOUND",
        "해당 시각의 실황이 없습니다."
      );
    }

    // 실황은 obsrValue 사용
    const weather = items.reduce((acc, it) => {
      acc[translateCategory(it.category)] = isNaN(it.obsrValue)
        ? it.obsrValue
        : Number(it.obsrValue);
      return acc;
    }, {});

    // 공통 메타
    const meta = {
      baseDate: items[0].baseDate,
      baseTime: items[0].baseTime,
    };

    return {
      date: meta.baseDate, // YYYYMMDD
      ...meta,
      location: { sido, gungu, nx, ny },
      weather,
    };
  } catch (e) {
    if (e instanceof CustomError) throw e;
    console.error("UltraNcst API Error:", e?.message);
    throw new CustomError("WEATHER_API_FAILED", "초단기 실황 조회 실패");
  }
};

// 초단기 실황 base 계산: (현재시각 - 10분) → 10분 단위 내림
function calculateUltraNcstBase(now) {
  const t = new Date(now.getTime() - 10 * 60 * 1000); // 지연 보정
  const yyyy = t.getFullYear();
  const mm = String(t.getMonth() + 1).padStart(2, "0");
  const dd = String(t.getDate()).padStart(2, "0");
  const HH = String(t.getHours()).padStart(2, "0");
  const MM = String(Math.floor(t.getMinutes() / 10) * 10).padStart(2, "0");

  return {
    baseDate: `${yyyy}${mm}${dd}`,
    baseTime: `${HH}${MM}`, // HHmm
  };
}
