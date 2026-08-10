import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Chat } from "../models/chat.model.js";
import { Booking } from "../models/booking.model.js";
import { Notification } from "../models/notification.model.js";

// 1. Send Message / Video Call Link
const sendMessage = asyncHandler(async (req, res) => {
    const { bookingId, message, isVideoCallRequest } = req.body;
    const senderId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const recipientId = booking.client.equals(senderId) ? booking.helper : booking.client;

    let videoCallUrl = null;
    if (isVideoCallRequest) {
        const roomName = `HelpHive-Interview-${booking._id.toString().substring(18)}`;
        videoCallUrl = `https://meet.jit.si/${roomName}`;
    }

    const chatMsg = await Chat.create({
        booking: bookingId,
        sender: senderId,
        recipient: recipientId,
        message: isVideoCallRequest ? `📹 Started Video Interview Call: ${videoCallUrl}` : message,
        videoCallUrl
    });

    await Notification.create({
        user: recipientId,
        title: isVideoCallRequest ? "📹 Video Interview Call Invitation" : "💬 New Message",
        message: isVideoCallRequest ? `Your client/helper initiated a 1-click video interview call.` : message.substring(0, 50),
        type: 'CHAT'
    });

    return res.status(201).json(new ApiResponse(201, chatMsg, "Message sent successfully"));
});

// 2. Fetch Chat History for Booking
const getChatHistory = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const messages = await Chat.find({ booking: bookingId })
        .populate("sender", "fullName profileImage role")
        .populate("recipient", "fullName profileImage role")
        .sort({ createdAt: 1 });

    return res.status(200).json(new ApiResponse(200, messages, "Chat history fetched successfully"));
});

export {
    sendMessage,
    getChatHistory
};
