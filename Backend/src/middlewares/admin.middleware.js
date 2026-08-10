import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRolesEnum } from "../constants.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    if (req.user?.role !== UserRolesEnum.ADMIN) {
        throw new ApiError(403, "You are not authorized to perform this action. Admin access required.");
    }
    next();
});