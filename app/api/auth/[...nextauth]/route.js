import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import mongo from '../../util/mongo'
import { cookies } from 'next/headers'

const authOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      try {
        cookies().set('email', user.user.email)
        cookies().set('name', user.user.name)
        const db = await mongo();
        const existingUser = await db.collection('User').findOne({ email: user.user.email });
        if (!existingUser) {
          await db.collection('User').insertOne({ email: user.user.email, name: user.user.name, profile_image: user.user.image });
        }
        return true;
      } catch (error) {
        console.error('Error connecting to database:', error);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(() => signIn(user, account, profile), 5000);
      }
    }
  }
})

export { authOptions as GET, authOptions as POST };
