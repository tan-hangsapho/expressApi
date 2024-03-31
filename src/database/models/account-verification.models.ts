import mongoose, { Document, Model } from "mongoose";

export interface IAccountVerificationDocument extends Document {
  userId: mongoose.Types.ObjectId;
  emailVerificationToken: string;
  createdAt: Date;
}

export interface IAccountVerificationModel
  extends Model<IAccountVerificationDocument> {}

const accountVerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  emailVerificationToken: {
    type: String,
    required: true,
    validate: (value: string): boolean => {
      if (!value || value.length !== 64) {
        throw new Error("Invalid email verfication token");
      }
      return true;
    },
    createdAt: { type: Date, default: Date.now }, // Token expiration time
  },
});

const AccountVerificationModel = mongoose.model<
  IAccountVerificationDocument,
  IAccountVerificationModel
>("AccountVerification", accountVerificationSchema);

export default AccountVerificationModel;
