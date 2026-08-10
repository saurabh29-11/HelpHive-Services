import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema({
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    videoCallUrl: { type: String }, // Optional video call room URL
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);
