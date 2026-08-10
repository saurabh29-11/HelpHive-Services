// Create this new controller file if it doesn't exist.
import mongoose from "mongoose";
import { Review } from "../models/review.model.js";
import { Booking, BookingStatusEnum } from "../models/booking.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createReview = asyncHandler(async (req, res) => {
    const { bookingId, rating, content } = req.body;
    const clientId = req.user._id;

    if (!bookingId || !rating || !content) {
        throw new ApiError(400, "Booking ID, rating, and content are required.");
    }

    if (!mongoose.isValidObjectId(bookingId)) {
        throw new ApiError(400, "Invalid Booking ID.");
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    // Authorization checks
    if (!booking.client.equals(clientId)) {
        throw new ApiError(403, "You can only review bookings you have made.");
    }
    if (booking.status !== BookingStatusEnum.COMPLETED) {
        throw new ApiError(400, "You can only review a completed booking.");
    }
    if (booking.review) {
        throw new ApiError(409, "A review for this booking already exists.");
    }

    // Create the review
    const review = await Review.create({
        content,
        rating: Number(rating),
        owner: clientId,
        helper: booking.helper,
    });

    if (!review) {
        throw new ApiError(500, "Failed to create the review.");
    }

    // Link the review back to the booking
    booking.review = review._id;
    await booking.save({ validateBeforeSave: false });

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review added successfully."));
});

// Function to get all reviews for a specific helper
const getHelperReviews = asyncHandler(async (req, res) => {
    const { helperId } = req.params;

    if (!mongoose.isValidObjectId(helperId)) {
        throw new ApiError(400, "Invalid Helper ID.");
    }

    const reviews = await Review.find({ helper: helperId })
        .populate("owner", "fullName profileImage") // Populate author details
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Reviews fetched successfully."));
});

export { createReview, getHelperReviews };