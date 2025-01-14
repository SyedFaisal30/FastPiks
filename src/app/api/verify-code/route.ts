import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(request:Request){
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodeUsername });

        if(!user){
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotexpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isCodeNotexpired){
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "User verified successfully",
                },
                { status: 200 }
            );
        } else if (!isCodeNotexpired){
            return Response.json(
                {
                    success: false,
                    message: "Code has expired",
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid code",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error in Verifying User ", error);
        return Response.json(
            {
                success: false,
                message: "Error in Verifying User",
            },
            { status: 500 }
        );
    }
}