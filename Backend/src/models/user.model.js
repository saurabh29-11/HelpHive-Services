import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
    AvailableServiceTypes,
    AvailableUserRoles,
    AvailableWorkerAvailabilities,
    UserRolesEnum,
    WorkerAvailabilityEnum,
} from "../constants.js";

const addressSchema = new Schema({
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    zipCode: {
        type: String,
        required: true,
        trim: true
    },
}, {
    _id: false
});

const userSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        phone: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: AvailableUserRoles,
            default: UserRolesEnum.USER,
            required: true,
        },

        refreshToken: {
            type: String,
        },

        // ================================
        // FORGOT PASSWORD / OTP FIELDS
        // ================================

        resetPasswordOTP: {
            type: String,
        },

        resetPasswordOTPExpiry: {
            type: Date,
        },

        resetPasswordToken: {
            type: String,
        },

        address: {
            type: addressSchema,
            required: true,
        },

        // ================================
        // WORKER-SPECIFIC FIELDS
        // ================================

        profileImage: {
            type: String,
        },

        introVideo: {
            type: String
        },

        coverImage: {
            type: String
        },

        primaryService: {
            type: String,
            enum: AvailableServiceTypes
        },

        experience: {
            type: Number,
            default: 0
        },

        tagline: {
            type: String,
            trim: true
        },

        description: {
            type: String
        },

        skills: {
            type: [String],
            default: []
        },

        isVerified: {
            id: {
                type: Boolean,
                default: false
            },

            police: {
                type: Boolean,
                default: false
            },

            pan: {
                type: Boolean,
                default: false
            },
        },

        availability: {
            type: String,
            enum: AvailableWorkerAvailabilities,
            default: WorkerAvailabilityEnum.AVAILABLE,
        },

        galleryImages: {
            type: [String],
            default: [],
        },

        pricing: {
            rate: {
                type: Number
            },

            per: {
                type: String,
                enum: ["hour", "day", "month"]
            }
        },

        verificationDocuments: {
            idProof: {
                type: String
            },

            policeVerification: {
                type: String
            },

            panCard: {
                type: String
            }
        }
    },

    {
        timestamps: true
    }
);


// ========================================
// PASSWORD HASHING
// ========================================

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);

    next();
});


// ========================================
// CHECK PASSWORD
// ========================================

userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);

};


// ========================================
// GENERATE ACCESS TOKEN
// ========================================

userSchema.methods.generateAccessToken = function () {

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: this.role,
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );

};


// ========================================
// GENERATE REFRESH TOKEN
// ========================================

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            _id: this._id,
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );

};


export const User = mongoose.model("User", userSchema);