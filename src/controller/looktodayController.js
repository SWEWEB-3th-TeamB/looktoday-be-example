import { createLooktodayService } from "../service/looktodayService.js";
import { ApiResponse } from "../response/apiResponse.js";
import { CustomError } from "../response/CustomError.js";

export const createLooktoday = async (req, res, next) => {
    try {
    const userId = req.user?.id; 
    if (!userId) throw new CustomError("UNAUTHORIZED", "로그인이 필요합니다.");

    const result = await createLooktodayService({
      ...req.body,     // date, time, si, gungu, ...
      userId,
    });

    return res.status(201).json(
      ApiResponse.success({
        code: "LOOKTODAY_CREATED",
        message: "룩투데이 등록 성공",
        result,
      })
    );
  } catch (err) {
    if (err instanceof CustomError) {
      return res.status(400).json(
        ApiResponse.fail({
          code: err.code,
          message: err.message,
          error: err.error,
        })
      );
    }

    next(err);
  }
};
