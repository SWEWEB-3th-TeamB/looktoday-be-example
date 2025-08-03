//기상청_단기예보 ((구)_동네예보) 조회서비스 API불러오기

import axios from "axios";
import { getCoordinates } from "../utils/locationMapper.js";
import { CustomError } from "../response/index.js";

// 기상청 단기예보 API 설정 (예: 실시간 초단기 예보)
const WEATHER_API_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const SERVICE_KEY = process.env.WEATHER_API_KEY;

export const getWeatherService = async (sido, gungu) => {
  // 1. 시도 + 군구 → nx, ny 좌표 조회
  const coords = getCoordinates(sido, gungu);
  if (!coords) {
    throw new CustomError("LOCATION_NOT_FOUND", "유효하지 않은 지역입니다.");
  }

  const { nx, ny } = coords;

  // 2. 날짜/시간 계산 (base_date, base_time)
  const now = new Date();
  const yyyyMMdd = now.toISOString().split("T")[0].replace(/-/g, "");
  const baseTime = calculateBaseTime(now); // 예: "0500", "1100" 등

  // 3. API 요청 파라미터 구성
  const queryString = new URLSearchParams({
    serviceKey: SERVICE_KEY, // 인코딩된 키여야 함
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

    return {
      date: yyyyMMdd,
      time: baseTime,
      location: { sido, gungu, nx, ny },
      weather: filteredItems, //모든 날짜 -> items, 일부 날짜 -> filteredItems
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
export const getWeatherServicewithCustomTime = async (
  sido,
  gungu,
  baseDate,
  baseTime
) => {
  const coords = getCoordinates(sido, gungu);
  if (!coords) {
    throw new CustomError("LOCATION_NOT_FOUND", "유효하지 않은 지역입니다.");
  }

  const { nx, ny } = coords;
  const base_date = baseDate.replace(/-/g, "");
  const base_datetime = Number(`${base_date}${baseTime}`); // 예: 202508022300

  const queryString = new URLSearchParams({
    serviceKey: SERVICE_KEY,
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date,
    base_time: baseTime,
    nx,
    ny,
  }).toString();

  const url = `${WEATHER_API_URL}?${queryString}`;

  try {
    const response = await axios.get(url);
    const items = response?.data?.response?.body?.items?.item;

    if (!items || items.length === 0) {
      throw new CustomError("WEATHER_API_FAILED", "날씨 정보가 없습니다.");
    }

    // fcstDate + fcstTime → 정수로 만들어 정렬
    const sorted = items
      .map((item) => ({
        ...item,
        datetime: Number(`${item.fcstDate}${item.fcstTime}`),
      }))
      .sort((a, b) => a.datetime - b.datetime);

    // 기준 시간 이후 가장 가까운 예보
    const target = sorted.find((item) => item.datetime >= base_datetime);

    if (!target) {
      throw new CustomError(
        "WEATHER_NOT_FOUND",
        "해당 시간 이후의 예보가 없습니다."
      );
    }

    // 같은 fcstDate + fcstTime 조합의 모든 항목(TMP, SKY, PTY 등) 필터링
    const filtered = items.filter(
      (item) =>
        item.fcstDate === target.fcstDate && item.fcstTime === target.fcstTime
    );

    return {
      date: baseDate,
      time: target.fcstTime,
      location: { sido, gungu, nx, ny },
      weather: filtered,
    };
  } catch (err) {
    console.error("Weather API Error:", err.message);
    throw new CustomError("WEATHER_API_FAILED", "날씨 정보 조회 실패");
  }
};
