import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema({
    worker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    checkInTime: { type: String }, // e.g. "09:00 AM"
    checkOutTime: { type: String }, // e.g. "05:00 PM"
    status: {
        type: String,
        enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'],
        default: 'PRESENT'
    },
    notes: { type: String }
}, { timestamps: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
