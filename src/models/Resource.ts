import mongoose, { Document, Model, Schema } from "mongoose";

export interface IResource extends Document {
  name: string;
  description?: string;
  location?: string;
  pricePerHour: number;
  isActive: boolean;
}

const resourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    pricePerHour: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Resource: Model<IResource> = mongoose.model<IResource>("Resource", resourceSchema);
