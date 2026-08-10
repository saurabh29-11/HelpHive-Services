import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User", // The user who wrote the review
            required: true,
        },
        helper: {
            type: Schema.Types.ObjectId,
            ref: "User", // The worker who is being reviewed
            required: true,
        },
    },
    { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);