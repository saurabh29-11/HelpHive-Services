import mongoose, { Schema } from 'mongoose';

const paymentSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    helper: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true, default: 500 },
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: ['HELD_IN_ESCROW', 'RELEASED_TO_WORKER', 'REFUNDED_TO_CLIENT'],
        default: 'HELD_IN_ESCROW'
    },
    paymentMethod: { type: String, default: 'UPI / Razorpay' },
    transactionId: { type: String, required: true },
    contractTitle: { type: String, default: 'HelpHive Official Service Agreement' }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
