import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";

const getUserNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notifications = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(20);

    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return res.status(200).json(new ApiResponse(200, {
        notifications,
        unreadCount
    }, "Notifications fetched successfully"));
});

const markNotificationRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });
    return res.status(200).json(new ApiResponse(200, null, "Notifications marked as read"));
});

export {
    getUserNotifications,
    markNotificationRead
};
