import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone number", type: "text", placeholder: "1231231231", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials: any) {
        if (!credentials.phone || !credentials.password) {
          throw new Error("Phone number and password are required.");
        }
   
        const existingUser = await db.user.findFirst({
          where: { number: credentials.phone },
        });
      
        if (!existingUser) {
          throw new Error("User not found.");
        }
      
        const isValidPassword = await bcrypt.compare(credentials.password, existingUser.password);
        if (!isValidPassword) {
          throw new Error("Incorrect password.");
        }

        return {
          id: existingUser.id.toString(),
          name: existingUser.name,
          number: existingUser.number,
        };
      },
    }),
  ], 
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      (session.user as { id: number }).id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/signin"
  }
};
