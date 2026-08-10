import mongoose, { Schema } from 'mongoose';

const notificationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['BOOKING', 'PAYMENT', 'CHAT', 'ATTENDANCE', 'SYSTEM'],
        default: 'SYSTEM'
    },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
