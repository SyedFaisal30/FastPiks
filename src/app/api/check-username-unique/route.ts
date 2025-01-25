import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const username = searchParams.get("username");

        if(!username){
            return Response.json(
                {
                    success: false,
                    message: "Missing username parameter ",
                },
                { status: 400 }
            );
        }

        const  result = UsernameQuerySchema.safeParse({username});

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json(
                {
                    success: false,
                    message:
                    usernameErrors.length > 0
                        ? usernameErrors.join(",")
                        : "Invalid username format",
                },
                { status: 400 }
            ) 
        }

        const { username: validatedUsername } = result.data;

        const existingUser = await UserModel.findOne({
            username: validatedUsername
        });

        if(existingUser){
            return Response.json(
                {
                    success: false,
                    message: "Username already Exist",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is available",
            },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error checking username:", error);
        return Response.json(
            {
                success:false,
                message:"Error checking username",
            },
            {
                status:500
            }
        );
    }
}