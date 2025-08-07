import { createLooktodayService } from "../service/looktodayService.js";
import { ApiResponse } from "../response/apiResponse.js";
import { CustomError } from "../response/CustomError.js";

export const createLooktoday = async (req, res, next) => {
  try {
    const result = await createLooktodayService(req.body);
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
