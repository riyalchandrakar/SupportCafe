import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  oid: { type: String, required: true },
  to_user: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String, default: '' },
  amount: { type: Number, required: true },
  paymentId: { type: String }, // Changed to optional for initial creation
  done: { type: Boolean, default: false },
  paymentAt: { type: Date },
  environment: { type: String, default: 'development' }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);