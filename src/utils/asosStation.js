// src/utils/asosStations.js

/** ---------------------------------------------------------
 * ASOS 전체 지점 코드/이름 목록 (문서 기준)
 * 좌표(lat/lon)는 별도. 거리 계산은 ASOS_STATIONS를 사용.
 * --------------------------------------------------------- */
export const ASOS_CODES = [
  // 수도권/강원권(일부)
  { stnId: 90, name: "속초" },
  { stnId: 93, name: "북춘천" },
  { stnId: 95, name: "철원" },
  { stnId: 98, name: "동두천" },
  { stnId: 99, name: "파주" },
  { stnId: 100, name: "대관령" },
  { stnId: 101, name: "춘천" },
  { stnId: 102, name: "백령도" },
  { stnId: 104, name: "북강릉" },
  { stnId: 105, name: "강릉" },
  { stnId: 106, name: "동해" },
  { stnId: 108, name: "서울" },
  { stnId: 112, name: "인천" },
  { stnId: 114, name: "원주" },
  { stnId: 115, name: "울릉도" },
  { stnId: 119, name: "수원" },
  { stnId: 121, name: "영월" },
  { stnId: 127, name: "충주" },
  { stnId: 129, name: "서산" },
  { stnId: 130, name: "울진" },
  { stnId: 131, name: "청주" },
  { stnId: 133, name: "대전" },
  { stnId: 135, name: "추풍령" },
  { stnId: 136, name: "안동" },
  { stnId: 137, name: "상주" },
  { stnId: 138, name: "포항" },
  { stnId: 140, name: "군산" },
  { stnId: 143, name: "대구" },
  { stnId: 146, name: "전주" },
  { stnId: 152, name: "울산" },
  { stnId: 155, name: "창원" },
  { stnId: 156, name: "광주" },
  { stnId: 159, name: "부산" },
  { stnId: 162, name: "통영" },
  { stnId: 165, name: "목포" },
  { stnId: 168, name: "여수" },
  { stnId: 169, name: "흑산도" },
  { stnId: 170, name: "완도" },
  { stnId: 172, name: "고창" },
  { stnId: 174, name: "순천" },
  { stnId: 177, name: "홍성" },
  { stnId: 184, name: "제주" },
  { stnId: 185, name: "고산" },
  { stnId: 188, name: "성산" },
  { stnId: 189, name: "서귀포" },
  { stnId: 192, name: "진주" },
  { stnId: 201, name: "강화" },
  { stnId: 202, name: "양평" },
  { stnId: 203, name: "이천" },
  { stnId: 211, name: "인제" },
  { stnId: 212, name: "홍천" },
  { stnId: 216, name: "태백" },
  { stnId: 217, name: "정선군" },
  { stnId: 221, name: "제천" },
  { stnId: 226, name: "보은" },
  { stnId: 232, name: "천안" },
  { stnId: 235, name: "보령" },
  { stnId: 236, name: "부여" },
  { stnId: 238, name: "금산" },
  { stnId: 239, name: "세종" },
  { stnId: 243, name: "부안" },
  { stnId: 244, name: "임실" },
  { stnId: 245, name: "정읍" },
  { stnId: 247, name: "남원" },
  { stnId: 248, name: "장수" },
  { stnId: 251, name: "고창군" },
  { stnId: 252, name: "영광군" },
  { stnId: 253, name: "김해시" },
  { stnId: 254, name: "순창군" },
  { stnId: 255, name: "북창원" },
  { stnId: 257, name: "양산시" },
  { stnId: 258, name: "보성군" },
  { stnId: 259, name: "강진군" },
  { stnId: 260, name: "장흥" },
  { stnId: 261, name: "해남" },
  { stnId: 262, name: "고흥" },
  { stnId: 263, name: "의령군" },
  { stnId: 264, name: "함양군" },
  { stnId: 266, name: "광양시" },
  { stnId: 268, name: "진도군" },
  { stnId: 271, name: "봉화" },
  { stnId: 272, name: "영주" },
  { stnId: 273, name: "문경" },
  { stnId: 276, name: "청송군" },
  { stnId: 277, name: "영덕" },
  { stnId: 278, name: "의성" },
  { stnId: 279, name: "구미" },
  { stnId: 281, name: "영천" },
  { stnId: 283, name: "경주시" },
  { stnId: 284, name: "거창" },
  { stnId: 285, name: "합천" },
  { stnId: 288, name: "밀양" },
  { stnId: 289, name: "산청" },
  { stnId: 294, name: "거제" },
  { stnId: 295, name: "남해" },
  // (필요 시 추가 확인하여 보강)
];

/** ---------------------------------------------------------
 * 거리 계산용: 좌표 포함 지점
 * 운영하면서 lat/lon을 계속 확장하세요.
 * --------------------------------------------------------- */
export const ASOS_STATIONS = [
  // 수도권/중부
  { stnId: 108, name: "서울", lat: 37.5714, lon: 126.9658 },
  { stnId: 112, name: "인천", lat: 37.4777, lon: 126.6249 },
  { stnId: 119, name: "수원", lat: 37.2577, lon: 127.002 },
  { stnId: 202, name: "양평", lat: 37.488, lon: 127.4889 },
  { stnId: 129, name: "서산", lat: 36.777, lon: 126.493 },
  { stnId: 131, name: "청주", lat: 36.6394, lon: 127.4407 },
  { stnId: 133, name: "대전", lat: 36.372, lon: 127.3721 },
  { stnId: 114, name: "원주", lat: 37.339, lon: 127.948 },
  { stnId: 101, name: "춘천", lat: 37.9026, lon: 127.7351 },
  { stnId: 105, name: "강릉", lat: 37.7515, lon: 128.8906 },
  // 영남/호남/제주 주요
  { stnId: 143, name: "대구", lat: 35.8779, lon: 128.6529 },
  { stnId: 152, name: "울산", lat: 35.5828, lon: 129.3323 },
  { stnId: 159, name: "부산", lat: 35.1047, lon: 129.0326 },
  { stnId: 156, name: "광주", lat: 35.1729, lon: 126.891 },
  { stnId: 165, name: "목포", lat: 34.8174, lon: 126.3818 },
  { stnId: 146, name: "전주", lat: 35.8219, lon: 127.148 },
  { stnId: 168, name: "여수", lat: 34.738, lon: 127.7405 },
  { stnId: 184, name: "제주", lat: 33.5141, lon: 126.5297 },
  { stnId: 189, name: "서귀포", lat: 33.2461, lon: 126.5653 },
  // 동해안/북부
  { stnId: 130, name: "울진", lat: 36.9931, lon: 129.4095 },
  { stnId: 115, name: "울릉도", lat: 37.4896, lon: 130.9061 },
  { stnId: 99, name: "파주", lat: 37.76, lon: 126.78 },
  // 필요에 따라 계속 보강
];

/** 좌표 보강용: 추가 좌표를 병합 */
export function mergeCoords(extraList = []) {
  const byId = new Map(ASOS_STATIONS.map((s) => [s.stnId, s]));
  for (const e of extraList) {
    if (!e?.stnId || e.lat == null || e.lon == null) continue;
    byId.set(e.stnId, {
      stnId: e.stnId,
      name: e.name ?? byId.get(e.stnId)?.name ?? "",
      lat: e.lat,
      lon: e.lon,
    });
  }
  return Array.from(byId.values());
}

/** 특정 ID 검색 */
export function findAsosById(stnId) {
  return ASOS_CODES.find((s) => s.stnId === Number(stnId)) || null;
}

/** 좌표 보유 여부 */
export function hasCoords(stnId) {
  return ASOS_STATIONS.some(
    (s) => s.stnId === Number(stnId) && s.lat != null && s.lon != null
  );
}
