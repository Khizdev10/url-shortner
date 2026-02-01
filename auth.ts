
// import NextAuth from "next-auth"
// import Google from "next-auth/providers/google"
 
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [Google],
  
// }
// )


// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Called whenever a user signs in
    async signIn({ user, account, profile }) {
      console.log("User info:", user);      // { name, email, image }
      console.log("Profile info:", profile); // full Google profile
      console.log("Account info:", account); // OAuth tokens, provider ID

      // Here you can add code to save the user to your database
      // e.g., check if the user exists, if not create a new record

      return true; // allow sign-in
    },

    // Called whenever a session is checked/created
    async session({ session, token, user }) {
      // You can attach additional user info to the session here
      // Example: session.user.id = token.uid
      return session;
    },
  },
});
