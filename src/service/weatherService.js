//기상청_단기예보 ((구)_동네예보) 조회서비스 API불러오기

import axios from "axios";
import { getCoordinates } from "../utils/locationMapper.js";
import { CustomError } from "../response/index.js";
import { translateCategory } from "../utils/weatherCategoryMapper.js";

import { chooseAsosStation } from "../utils/nearestAsos.js"; // ASOS 관측소 선택

// 기상청 단기예보 API 설정 (예: 실시간 초단기 예보)
const WEATHER_API_URL =
  "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst";
const FORECAST_SERVICE_KEY = process.env.WEATHER_API_KEY;

//오늘의 날씨 - 날씨 예보 정보
export const getWeatherService = async (sido, gungu) => {
  //1.시도 + 군구 로 nx, ny 좌표 조회
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

//looktoday 추가 시 들어갈 확정 날씨 정보

const ASOS_ENDPOINT =
  "https://apis.data.go.kr/1360000/AsosHourlyInfoService/getWthrDataList";

// 공공데이터포털 키 (Encoding/Decoding 어느 쪽이든 동작하게 처리)
const RAW_KEY = process.env.WEATHER_ASOS_API_KEY;
const ASOS_SERVICE_KEY = (() => {
  if (!RAW_KEY) throw new Error("WEATHER_ASOS_API_KEY is missing");
  try {
    return decodeURIComponent(RAW_KEY);
  } catch {
    return RAW_KEY;
  }
})();

// 한국시간 now
function nowKST() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" })
  );
}

// ASOS는 D-1 자료를 11시 이후 제공 → 기본값: 전일의 현재 ‘정시’
function defaultAsosDateHour() {
  const kst = nowKST();
  kst.setDate(kst.getDate() - 1);
  const y = kst.getFullYear();
  const m = String(kst.getMonth() + 1).padStart(2, "0");
  const d = String(kst.getDate()).padStart(2, "0");
  const h = String(kst.getHours()).padStart(2, "0");
  return { date: `${y}${m}${d}`, hour: h };
}

/**
 * 시도/군구 + (옵션) date/hour → 최근접 ASOS 관측소의 특정 ‘한 시간’ 관측값
 * @param {string} sido
 * @param {string} gungu
 * @param {string=} date  "YYYY-MM-DD" 또는 "YYYYMMDD"
 * @param {string|number=} hour "HH" (0~23)
 */
export async function getAsosObservedAt(sido, gungu, date, hour) {
  // 1) 최근접 관측소 선택
  const picked = chooseAsosStation(sido, gungu); // { station: { stnId, ... }, centroid }
  const stnId = picked.station.stnId;

  // 2) 조회 시각 설정
  let startDt, startHh;
  if (date && hour !== undefined) {
    startDt = String(date).replace(/-/g, ""); // YYYYMMDD
    startHh = String(hour).padStart(2, "0"); // HH
  } else {
    const def = defaultAsosDateHour();
    startDt = def.date;
    startHh = def.hour;
  }

  // 3) API 호출 (해당 ‘정시’ 한 타임만)
  const qs = new URLSearchParams({
    serviceKey: ASOS_SERVICE_KEY,
    dataCd: "ASOS",
    dateCd: "HR",
    startDt,
    startHh,
    endDt: startDt,
    endHh: startHh,
    stnIds: String(stnId),
    dataType: "JSON",
    numOfRows: "10",
    pageNo: "1",
  }).toString();

  const url = `${ASOS_ENDPOINT}?${qs}`;

  try {
    const { data } = await axios.get(url, { timeout: 10000 });
    const header = data?.response?.header;
    const items = data?.response?.body?.items?.item;

    if (!header || header.resultCode !== "00") {
      const code = header?.resultCode ?? "NO_HEADER";
      const msg = header?.resultMsg ?? "기상청 응답 헤더 없음";
      throw new CustomError("KMA_ERROR", `기상청 에러(${code}): ${msg}`);
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new CustomError(
        "NODATA_ERROR",
        "해당 시각의 관측 데이터가 없습니다."
      );
    }

    const it = items[0]; // 일반적으로 1건

    const weather = {
      "기온(°C)": it.ta != null ? Number(it.ta) : null,
      "습도(%)": it.hm != null ? Number(it.hm) : null,
      "강수량(mm)": it.rn != null ? Number(it.rn) : null,
      "풍속(m/s)": it.ws != null ? Number(it.ws) : null,
      "풍향(16방위)": it.wd != null ? Number(it.wd) : null,
      "현지기압(hPa)": it.pa != null ? Number(it.pa) : null,
      "해면기압(hPa)": it.ps != null ? Number(it.ps) : null,
      "일조(hr)": it.ss != null ? Number(it.ss) : null,
      "일사(MJ/m2)": it.icsr != null ? Number(it.icsr) : null,
      "시정(10m)": it.vs != null ? Number(it.vs) : null,
      "적설(cm)": it.dsnw != null ? Number(it.dsnw) : null,
    };

    return {
      meta: {
        request: { sido, gungu },
        pickedStation: picked.station,
        centroid: picked.centroid,
        time: { date: startDt, hour: startHh },
      },
      weather,
      raw: items, // 필요 없으면 삭제
    };
  } catch (err) {
    if (err instanceof CustomError) throw err;
    console.error("ASOS API Error:", err?.response?.data ?? err.message);
    throw new CustomError("ASOS_API_FAILED", "ASOS 관측자료 조회 실패");
  }
}
