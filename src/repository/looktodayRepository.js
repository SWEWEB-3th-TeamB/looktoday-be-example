import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//1. 이미지 저장 - 나중에 s3에 저장 로직으로 변경
export const createPost = async ({
  userId, date, time, si, gungu,
  apparent_temp, apparent_humidity,
  isPublic, imageUrl, comment,
  temp,                // ← 실황 T1H 저장
}) => {
  return prisma.post.create({
    data: {
      userId,
      date,           // Date or ISO string
      time,           // "HHmm" (optional)
      si,
      gungu,
      temp,           // ← 새 필드
      apparent_temp,
      apparent_humidity,
      isPublic,
      imageUrl,
      comment,
    },
  });
};