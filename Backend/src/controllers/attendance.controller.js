import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Attendance } from "../models/attendance.model.js";
import { Booking } from "../models/booking.model.js";

// 1. Worker Check-In / Check-Out
const markAttendance = asyncHandler(async (req, res) => {
    const { bookingId, action, notes } = req.body; // action: 'CHECK_IN' or 'CHECK_OUT'
    const workerId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Active booking not found");
    }

    if (!booking.helper.equals(workerId)) {
        throw new ApiError(403, "Only the assigned worker can mark attendance.");
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    let attendance = await Attendance.findOne({ booking: bookingId, date: todayStr });

    if (action === 'CHECK_IN') {
        if (!attendance) {
            attendance = await Attendance.create({
                worker: workerId,
                client: booking.client,
                booking: bookingId,
                date: todayStr,
                checkInTime: nowTimeStr,
                status: 'PRESENT',
                notes: notes || 'Worker checked in on time.'
            });
        } else {
            attendance.checkInTime = nowTimeStr;
            attendance.status = 'PRESENT';
            if (notes) attendance.notes = notes;
            await attendance.save();
        }
    } else if (action === 'CHECK_OUT') {
        if (!attendance) {
            attendance = await Attendance.create({
                worker: workerId,
                client: booking.client,
                booking: bookingId,
                date: todayStr,
                checkOutTime: nowTimeStr,
                status: 'PRESENT',
                notes: notes || 'Worker checked out.'
            });
        } else {
            attendance.checkOutTime = nowTimeStr;
            if (notes) attendance.notes = notes;
            await attendance.save();
        }
    }

    return res.status(200).json(new ApiResponse(200, attendance, `Attendance marked successfully (${action})`));
});

// 2. Fetch Monthly Attendance Log for Booking
const getBookingAttendance = asyncHandler(async (req, res) => {
    const { bookingId } = req.params;

    const logs = await Attendance.find({ booking: bookingId }).sort({ date: -1 });

    const totalDays = logs.length;
    const presentDays = logs.filter(l => l.status === 'PRESENT').length;

    return res.status(200).json(new ApiResponse(200, {
        logs,
        stats: { totalDays, presentDays }
    }, "Attendance logs fetched successfully"));
});

export {
    markAttendance,
    getBookingAttendance
};
