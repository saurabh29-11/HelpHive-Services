import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { UserRolesEnum } from "../constants.js";

// Controller to fetch all helpers with filtering
const getAllHelpers = asyncHandler(async (req, res) => {
  const { searchTerm, locationTerm, service, verified, availability } = req.query;

  // Start with a base match stage for the aggregation pipeline
  const matchStage = { role: UserRolesEnum.WORKER };

  // Build the match stage dynamically
  if (searchTerm) {
    matchStage.$or = [
      { fullName: { $regex: searchTerm, $options: "i" } },
      { primaryService: { $regex: searchTerm, $options: "i" } },
    ];
  }
    if (locationTerm) {
        // Change this line to query the nested address object
        matchStage['address.city'] = { $regex: locationTerm, $options: "i" };
    }
  if (service && service.toLowerCase() !== "all") {
    matchStage.primaryService = service;
  }
  if (verified && verified.toString() === "true") {
    matchStage["isVerified.id"] = true;
    matchStage["isVerified.police"] = true;
  }
  if (availability && availability !== 'All') {
    matchStage.availability = availability;
  }
  
  // --- NEW AGGREGATION PIPELINE ---
  const helpersPipeline = [
    {
      $match: matchStage
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "helper",
        as: "reviewsData",
      },
    },
    {
      $lookup: {
        from: "bookings",
        let: { helperId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$helper", "$$helperId"] },
                  { $eq: ["$status", "CONFIRMED"] }
                ]
              }
            }
          }
        ],
        as: "confirmedBookings"
      }
    },
    {
      $addFields: {
        averageRating: { $ifNull: [{ $avg: "$reviewsData.rating" }, 0] },
        reviewCount: { $size: "$reviewsData" },
        isCurrentlyBooked: { $gt: [{ $size: "$confirmedBookings" }, 0] },
        activeBookingInfo: { $first: "$confirmedBookings" }
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        reviewsData: 0,
        confirmedBookings: 0,
        email: 0,
      }
    }
  ];

  const helpers = await User.aggregate(helpersPipeline);

  return res
    .status(200)
    .json(new ApiResponse(200, helpers, "Helpers fetched successfully"));
});

// Controller to fetch a single helper's profile by ID
const getHelperProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid helper ID format");
    }
    
    const helperId = new mongoose.Types.ObjectId(id);

    const helperProfilePipeline = [
        {
            $match: {
                _id: helperId,
                role: UserRolesEnum.WORKER,
            },
        },
        // Stage 2: Join with reviews and populate the owner of each review
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "helper",
                as: "reviews",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        profileImage: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: { $first: "$ownerDetails" }
                        }
                    },
                    {
                        $project: { ownerDetails: 0 }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "bookings",
                let: { helperId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$helper", "$$helperId"] },
                                    { $eq: ["$status", "CONFIRMED"] }
                                ]
                            }
                        }
                    }
                ],
                as: "confirmedBookings"
            }
        },
        // Stage 3: Calculate average rating and review count
        {
            $addFields: {
                averageRating: { $ifNull: [{ $avg: "$reviews.rating" }, 0] },
                reviewCount: { $size: "$reviews" },
                isCurrentlyBooked: { $gt: [{ $size: "$confirmedBookings" }, 0] },
                activeBookingInfo: { $first: "$confirmedBookings" }
            },
        },
        // Stage 4: Use blacklisting to remove sensitive fields
        {
            $project: {
                password: 0,
                refreshToken: 0,
                confirmedBookings: 0,
                "reviews.ownerDetails": 0 // Clean up any lingering sensitive data
            }
        }
    ];

    const helperProfileArray = await User.aggregate(helperProfilePipeline);

    if (!helperProfileArray || helperProfileArray.length === 0) {
        throw new ApiError(404, "Helper profile not found");
    }

    // Now this single object contains the helper profile AND their detailed reviews
    return res.status(200).json(
        new ApiResponse(200, helperProfileArray[0], "Helper profile fetched successfully")
    );
});


export { getAllHelpers, getHelperProfile };