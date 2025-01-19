import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import VerificationModel from "@/models/Verification.model";
import bcrypt from "bcryptjs";
import sendEmail from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, username, password } = await request.json();

        console.log("Received data:", { email, username });
        // Check if the user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User already exists with this email or username.",
                }),
                { status: 400 }
            );
        }

        // Check if a verification is already pending for this email
        const existingVerification = await VerificationModel.findOne({ email });
        if (existingVerification) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "A verification request is already pending for this email.",
                }),
                { status: 400 }
            );
        }

        // Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Generate the verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
        const verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Save the verification details
        const verification = new VerificationModel({
            username,
            email,
            otp: verificationCode,
            password: hashedPassword,
            expiresAt: verifyCodeExpiry,
        });
        await verification.save();

        console.log(`Verification code sent successfully on {${email}}.`);
        // Send the verification email
        await sendEmail(username, email, verificationCode);
        
        return new Response(
            JSON.stringify({
                success: true,
                message: "Verification code sent successfully.",
            }),
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error occurred while sending verification code: ", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error occurred while sending verification code.",
                error: error.message || "Unknown error",
            }),
            { status: 500 }
        );
    }
}
