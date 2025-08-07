import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//1. 이미지 저장 - 나중에 s3에 저장 로직으로 변경
export const createPost = async ({
  userId,
  date,
  si,
  gungu,
  apparent_temp,
  apparent_humidity,
  isPublic,
  imageUrl,
}) => {
  return await prisma.post.create({
    data: {
      userId,
      date: new Date(date),
      si,
      gungu,
      apparent_temp,
      apparent_humidity,
      isPublic,
      imageUrl,
    },
  });
};
