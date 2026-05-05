import mongoose, { Document, Model, Schema } from "mongoose";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  resource: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status: BookingStatus;
  paymentIntentId?: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    resource: { type: Schema.Types.ObjectId, ref: "Resource", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending"
    },
    paymentIntentId: { type: String }
  },
  { timestamps: true }
);

bookingSchema.index({ resource: 1, startTime: 1, endTime: 1 });

export const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", bookingSchema);
