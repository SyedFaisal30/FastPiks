import mongoose, { Schema, Document } from "mongoose";

export interface Verification extends Document {
    email: string;
    username: string;
    otp: string;
    password: string;
    createdAt: Date;
    expiresAt: Date;
}

const VerificationSchema: Schema<Verification> = new Schema({
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    otp: {
        type: String,
        required: [true, "OTP is required"],
    },
    password:{
        type: String,
        required: [true, "Password is required"],
    },
    expiresAt: {
        type: Date,
        required: true, // Expiration time for the OTP
    },
      createdAt: {
        type: Date,
        default: Date.now, // Timestamp when the entry was created
        expires: 600, // Automatically delete the document after 10 minutes (600 seconds)
    },
})

const VerificationModel = (mongoose.models.Verification as mongoose.Model<Verification>) || mongoose.model<Verification>("Verification", VerificationSchema);

export default VerificationModel;