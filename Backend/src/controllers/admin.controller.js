import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRolesEnum } from "../constants.js";
import mongoose from "mongoose";

const getAllUsers = asyncHandler(async (req, res) => {
    // TODO: Add pagination here later
    const users = await User.find({}).select("-password -refreshToken");
    return res
        .status(200)
        .json(new ApiResponse(200, users, "All users fetched successfully"));
});

const getWorkerVerificationRequests = asyncHandler(async (req, res) => {
    // Find workers where at least one of their verification statuses is false
    const workers = await User.find({
        role: UserRolesEnum.WORKER,
        $or: [
            { "isVerified.id": false },
            { "isVerified.police": false },
            { "isVerified.pan": false }
        ]
    }).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, workers, "Verification requests fetched successfully"));
});

const updateWorkerVerification = asyncHandler(async (req, res) => {
    const { workerId } = req.params;
    const { idVerified, policeVerified, panVerified } = req.body; // Expecting boolean values

    if (!mongoose.isValidObjectId(workerId)) {
        throw new ApiError(400, "Invalid worker ID");
    }

    const worker = await User.findById(workerId);
    if (!worker || worker.role !== UserRolesEnum.WORKER) {
        throw new ApiError(404, "Worker not found");
    }

    // Update the verification status based on what the admin sends
    if (typeof idVerified === 'boolean') {
        worker.isVerified.id = idVerified;
    }
    if (typeof policeVerified === 'boolean') {
        worker.isVerified.police = policeVerified;
    }
    if (typeof panVerified === 'boolean') {
        worker.isVerified.pan = panVerified;
    }

    await worker.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, worker.isVerified, "Worker verification status updated"));
});

const getWorkerDetails = asyncHandler(async (req, res) => {
    const { workerId } = req.params;

    if (!mongoose.isValidObjectId(workerId)) {
        throw new ApiError(400, "Invalid worker ID");
    }
    
    // Fetch everything except sensitive fields
    const worker = await User.findById(workerId).select("-password -refreshToken");

    if (!worker || worker.role !== UserRolesEnum.WORKER) {
        throw new ApiError(404, "Worker not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, worker, "Worker details fetched successfully"));
});


// Update your exports
export {
    getAllUsers,
    getWorkerVerificationRequests,
    updateWorkerVerification,
    getWorkerDetails, // Add new export
};