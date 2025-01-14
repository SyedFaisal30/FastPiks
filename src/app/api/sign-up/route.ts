import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import sendVerificationEmail from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username , email, password } = await request.json(); 
        console.log("Username:", username, "Email:", email, "Password:", password);
        
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });

        let verifyCode = Math.floor(Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists",
                    },
                    { status: 400 }
                )
            } else {
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                cart:[],
            });

            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(
            email, 
            username,
            verifyCode
        );

        if(!emailResponse){
            return Response.json(
                {
                    success:false,
                    message:emailResponse.message,
                },
                {status:500}
            )
        }

        return Response.json(
            {
                success: true,
                message: "User created successfully",
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error in Registering User ",error);
        return Response.json(
            {
                success: false, 
                message: "Error in Registering User",
            },
            { status: 500 }
        );
    }
}