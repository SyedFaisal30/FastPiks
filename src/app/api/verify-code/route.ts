import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import VerificationModel from "@/models/Verification.model";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        // Validate input
        if (!code || !username) {
            return Response.json(
                {
                    success: false,
                    message: "Username and code are required",
                },
                { status: 400 }
            );
        }

        // Find the verification record by the code and username
        const verification = await VerificationModel.findOne({ username, otp: code });
        if (!verification) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid code or username",
                },
                { status: 400 }
            );
        }

        // Check if the code has expired
        if (verification.expiresAt < new Date()) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code expired",
                },
                { status: 400 }
            );
        }

        // Now copy data from VerificationModel to UserModel and mark as verified
        let user = await UserModel.findOne({ username });

        // If user does not exist, create a new user using the verification data
        if (!user) {
            user = new UserModel({
                username: verification.username,
                email: verification.email,
                password: verification.password, // assuming you are saving a hashed password
                isVerified: true,
            });
        } else {
            // If the user exists, just update the verification status
            user.isVerified = true;
        }

        await user.save();

        // Delete the verification record
        await VerificationModel.deleteOne({ username, otp: parseInt(code) });

        return Response.json(
            {
                success: true,
                message: "Account verified successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during verification:", error);
        return Response.json(
            {
                success: false,
                message: "Error during verification",
            },
            { status: 500 }
        );
    }
}
