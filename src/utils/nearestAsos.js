//가장 가까운 ASOS 선택

import { ASOS_STATIONS } from "./asosStation.js";
import { getAdminLatLon } from "./locationMapper.js";
import { CustomError } from "../response/CustomError.js";

const toRad = (d) => (d * Math.PI) / 180;
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371_000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/* 위경도 기준 가장 가까운 ASOS 관측소 반환 */
export function pickNearestAsosByLatLon(lat, lon) {
  let best = null,
    bestD = Infinity;
  for (const s of ASOS_STATIONS) {
    const d = haversine(lat, lon, s.lat, s.lon);
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best ? { ...best, distanceMeters: Math.round(bestD) } : null;
}

export function chooseAsosStation(sido, gungu) {
  const centroid = getAdminLatLon(sido, gungu); // { lat, lon }
  if (!centroid) {
    throw new CustomError("LOCATION_NOT_FOUND", "유효하지 않은 지역입니다.");
  }

  const station = pickNearestAsosByLatLon(centroid.lat, centroid.lon);
  if (!station) {
    throw new CustomError("STATION_NOT_FOUND", "관측소를 찾지 못했습니다.");
  }

  return {
    request: { sido, gungu },
    centroid, // { lat, lon }
    station, // { stnId, name, lat, lon, distanceMeters }
  };
}
