import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "next-auth";
import prisma from "./prisma";


export const authConfig: NextAuthOptions = {
    providers:[
      CredentialsProvider({
        name: "Sign in",
        credentials: {
          email: {
            label: "Email",
            type: "email",
            placeholder: "example@example.com",
          },
          password: { label: "Password", type: "password",placeholder:"password" },
        },
        async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<User | null> {
          console.log("Credentials received:", credentials);
          const user = {
            id: "1", // Ensure ID is a string
            name: "John Doe",
            email: credentials?.email ?? "",
            // Add other fields if needed
          };
        
          if (user) {
            return user;
          } else {
            return null;
          }
        }
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    ),
    ],
    secret : process.env.NEXT_AUTH_SECRET,
    pages :{
      signIn: '/signin',
    },
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        // Check if the user exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        })
  
        if (!existingUser) {
          // If the user does not exist, create a new user in the database
          await prisma.user.create({
            data: {
              name: user.name as string,
              email: user.email as string,
              password: "OAUTH_PLACEHOLDER_PASSWORD",
            },
          })
        }
  
        // Return true to indicate that sign-in should be successful
        return true
      },
      async session({ session, token, user }) {
        // Include user.id in the session
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user?.email as string },
        })
        session.user.id = dbUser?.id
        return session
      },
    },
    
}