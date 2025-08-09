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
    comment,
  } = data;

  const safeComment =
    typeof comment === "string" && comment.trim().length > 0
      ? comment.trim().slice(0, 40)
      : null;

  const post = await createPost({
    userId,
    date,
    si,
    gungu,
    apparent_temp,
    apparent_humidity,
    isPublic,
    imageUrl,
    comment: safeComment,
  });
  return post;
};
