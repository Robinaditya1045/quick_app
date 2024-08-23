import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { User } from "next-auth"


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
    
}