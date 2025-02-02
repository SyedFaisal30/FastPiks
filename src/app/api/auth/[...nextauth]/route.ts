import NextAuth from "next-auth/next";
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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log("Credentials Received:", credentials);

        try {
          // Find user by email or username
          const user = await UserModel.findOne({ email: credentials.email });

          console.log("User Found:", user);

          if (!user) {
            throw new Error("Invalid email!");
          }

          // Compare the password
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password!");
          }

          // Return user if successful
          return user;

        } catch (error: any) {
          console.error("Auth Error:", error.message);
          throw new Error(error.message || "Something went wrong!");
        }
      },
    }),
  ],
  callbacks:{
    async jwt({token,user}){
      if(user){
        token.isAdmin = user.isAdmin;
        token.id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }   
      return token; 
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username; // ✅ Properly assigning username
      }
      return session;
    },  
    async redirect({ url, baseUrl }) {
      // Redirect to the homepage after successful login
      return baseUrl+"/"; // This will redirect to the homepage ("/")
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,  
  pages: {
    signIn: "/sign-in",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };