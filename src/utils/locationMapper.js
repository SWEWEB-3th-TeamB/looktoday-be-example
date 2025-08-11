// utils/locationMapper.js
//시도, 군구를 기반으로 util의 locationList.js에서 해당 지역의 x,y좌표 찾아 반환

import { locationList } from "../data/locationList.js";
import { gridToLatLon } from "./dfsGrid.js";

//동네 예보용
export function getCoordinates(sido, gungu) {
  const keySido = sido.trim();
  const keyGungu = gungu.trim();

  const match = locationList.find(
    (item) => item.sido === keySido && item.gungu === keyGungu
  );

  return match ? { nx: match.nx, ny: match.ny } : null;
}

//관측소 선택: 위경도 반환
export function getAdminLatLon(sido, gungu) {
  const grid = getCoordinates(sido, gungu);
  if (!grid) return null;
  return gridToLatLon(grid.nx, grid.ny);
}
