//기상청이 쓰는 격자 좌표(nx, ny)와 실제 위경도 사이를 변환하는 코드

const RE = 6371.00877; //지구 반경(km)
const GRID = 5.0; //격자 간격(km)
const SLAT1 = 30.0, //투영 위도 기준
  SLAT2 = 60.0;
const OLON = 126.0, //기준점(위경두)
  OLAT = 38.0;
const XO = 43, //기준점의 격자 좌표
  YO = 136;

const DEGRAD = Math.PI / 180.0;
const RADDEG = 180.0 / Math.PI;

function init() {
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD,
    slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD,
    olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);
  return { re, olon, sn, sf, ro };
}

export function gridToLatLon(nx, ny) {
  const { re, olon, sn, sf, ro } = init();
  const x = nx - XO,
    y = ny - YO;
  const ra = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(x, ro - y);
  const alat =
    2.0 * Math.atan(Math.pow((re * sf) / ra, 1.0 / sn)) - Math.PI * 0.5;
  const alon = theta + olon;
  return { lat: alat * RADDEG, lon: alon * RADDEG };
}
