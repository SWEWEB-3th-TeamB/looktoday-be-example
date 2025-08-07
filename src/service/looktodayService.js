//여기서 할일
//1. looktoday 저장
import { createPost } from "../repository/looktodayRepository.js";

export const createLooktodayService = async (data) => {
  const {
    userId,
    date,
    si,
    gungu,
    apparent_temp,
    apparent_humidity,
    isPublic,
    imageUrl,
  } = data;

  const post = await createPost({
    userId,
    date,
    si,
    gungu,
    apparent_temp,
    apparent_humidity,
    isPublic,
    imageUrl,
  });
  return post;
};
