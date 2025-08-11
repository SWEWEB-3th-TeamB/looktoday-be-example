// 카테고리 영문 → 한글 변환 매핑
const categoryMap = {
  TMP: "기온(°C)",
  UUU: "동서바람성분(m/s)",
  VVV: "남북바람성분(m/s)",
  VEC: "풍향(°)",
  WSD: "풍속(m/s)",
  SKY: "하늘상태",
  PTY: "강수형태",
  POP: "강수확률(%)",
  WAV: "파고(m)",
  PCP: "1시간 강수량(mm)",
  REH: "습도(%)",
  SNO: "1시간 신적설(cm)",

  T1H: "기온(°C)",              // Temperature
  RN1: "1시간 강수량(mm)",       // Rainfall 1h
  LGT: "낙뢰",                   // Lightning
};

/**
 * 카테고리 영문 약자를 한글명으로 변환
 * @param {string} code - 카테고리 코드
 * @returns {string} 한글 설명 (없으면 원본 반환)
 */
export function translateCategory(code) {
  return categoryMap[code] || code;
}
