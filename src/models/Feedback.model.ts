import mongoose, { Schema, Document } from "mongoose";

export interface Feedback extends Document {
    name: string;
    email: string;
    message: string;
}

const FeedbackSchema: Schema<Feedback> = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
});

const FeedbackModel = mongoose.model<Feedback>("Feedback", FeedbackSchema);
export default FeedbackModel;