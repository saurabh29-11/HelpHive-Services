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
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: { type: String, required: true, trim: true },
}, {_id: false});

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
    address: {
    type: addressSchema,
    required: true, // Address is now mandatory for everyone
    },

    // Worker-specific fields
    profileImage: {
      type: String,
    },
    introVideo: { type: String },
    coverImage: { type: String },
    primaryService: { type: String, enum: AvailableServiceTypes },
    experience: { type: Number, default: 0 },
    // We are removing the old 'city' field in favor of the address object
    tagline: { type: String, trim: true },
    description: { type: String },
    skills: { type: [String], default: [] },
    isVerified: {
        id: { type: Boolean, default: false },
        police: { type: Boolean, default: false },
        pan: { type: Boolean, default: false },
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
    pricing: { // New field for worker pricing
        rate: { type: Number }, // e.g., 500
        per: { type: String, enum: ['hour', 'day', 'month'] } // e.g., 'hour'
    },
    verificationDocuments: { // New field for document uploads
        idProof: { type: String }, // Cloudinary URL
        policeVerification: { type: String }, // Cloudinary URL
        panCard: { type: String } // Cloudinary URL
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

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