import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log("Credentials Received:", credentials);

        try {
          // Find user by email or username
          const user = await UserModel.findOne({
            $or: [{ email: credentials.email }, { username: credentials.identifier }],
          });

          console.log("User Found:", user);

          if (!user) {
            throw new Error("User not found with email or username!");
          }

          if (!user.isVerified) {
            throw new Error("User is not verified!");
          }

          // Compare the password
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password!");
          }

          // Return user if successful
          return user;

        } catch (error: any) {
          throw new Error(error.message || "Something went wrong!");
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token,user}){
      if(user){
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }   
      return token; 
    },
    async session({session,token}){
      if(token){
        token._id = token._id?.toString();
        token.isVerified = token.isVerified;
        token.username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,  
  pages: {
    signIn: "/sign-in",
  }
};
