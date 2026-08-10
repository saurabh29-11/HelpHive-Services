import mongoose, { Schema } from "mongoose";

export const BookingStatusEnum = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    REJECTED: "REJECTED",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED", 
};

const bookingSchema = new Schema(
    {
        client: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        helper: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        bookingDate: {
            type: Date,
            required: true,
        },
        bookingTime: {
            type: String, // Storing as a string like "14:30" for simplicity
            required: true,
        },
        duration: {
            type: String, // e.g., "1 Month", "3 Months", "6 Months", "1 Year", "1 Day"
            default: "1 Month",
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        workShift: {
            type: String, // e.g., "Full Time (8 Hours)", "Live-in (24 Hours)", "Part Time (4 Hours)"
            default: "Full Time (8 Hours)",
        },
        message: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(BookingStatusEnum),
            default: BookingStatusEnum.PENDING,
            required: true,
        },
        review: {
            type: Schema.Types.ObjectId,
            ref: "Review",
            default: null, // Link to the review once it's created
        },
    },
    { timestamps: true }
);

export const Booking = mongoose.model("Booking", bookingSchema);