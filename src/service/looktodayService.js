//여기서 할일
//1. looktoday 저장
import { createPost } from "../repository/looktodayRepository.js";
import { createWeather } from "../repository/weatherRepositiory.js";
import { CustomError } from "../response/CustomError.js";
import { getUltraNowcastService } from "./weatherService.js";


export const createLooktodayService = async (data) => {
  const {
    userId,
    date,
    time,
    si,
    gungu,
    apparent_temp,
    apparent_humidity,
    isPublic,
    imageUrl,
    comment,
  } = data;

  // 1) 초단기 실황 조회 (translateCategory 적용된 한글 라벨 가정)
  let obs = null;
  try {
    const nowcast = await getUltraNowcastService(si, gungu, { date, time });
    const w = nowcast.weather ?? {};
    obs = {
      tmp: Number(w["기온(°C)"]),                       // T1H
      reh: Number(w["습도(%)"]),                         // REH
      wsd: Number(w["풍속(m/s)"]),                       // WSD
      vec: Math.round(Number(w["풍향(°)"])),             // VEC
      uuu: Number(w["동서바람성분(m/s)"]),              // UUU
      vvv: Number(w["남북바람성분(m/s)"]),              // VVV
      pty: Number(w["강수형태"]),                        // PTY
      pcp: w["1시간 강수량(mm)"] == null ? null : String(w["1시간 강수량(mm)"]), // RN1
      lgt: w["낙뢰"] == null ? null : Number(w["낙뢰"]), // LGT
    };
  } catch (e) {
    console.warn("Ultra nowcast fetch failed, proceed without weather:", e?.message || e);
  }

  //post 생성하기
  const safeComment =
    typeof comment === "string" && comment.trim().length > 0
      ? comment.trim().slice(0, 40)
      : null;

  const post = await createPost({
    userId,
    date,
    time: time || null,
    si,
    gungu,
    temp: obs?.tmp ?? null,
    apparent_temp,
    apparent_humidity,
    isPublic,
    imageUrl,
    comment: safeComment,
  }); 
  
  //weather에 날씨 정보 저장
  try {
    if (obs) {
      await createWeather({
        looktodayId: post.id,
        sido: si,
        gungu,
        date, // 'YYYY-MM-DD' 그대로
        time,

        tmp: obs.tmp ?? 0,
        reh: Number.isFinite(obs.reh) ? Math.round(obs.reh) : 0,
        wsd: obs.wsd ?? 0,
        vec: obs.vec ?? 0,
        uuu: obs.uuu ?? 0,
        vvv: obs.vvv ?? 0,
        pty: Number.isFinite(obs.pty) ? obs.pty : 0,
        pcp: obs.pcp ?? null,
        lgt: obs.lgt ?? null,
      });
    }
  } catch (e) {
    console.error("Weather save failed:", e?.message || e);
  }

  return post;
};