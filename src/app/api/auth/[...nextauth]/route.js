'use server'
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import User from '@/models/User';
import connectDB from '@/db/connectDB';

export const authoptions = NextAuth({
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user user:email'
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user, account, profile }) {
            await connectDB();
            
            try {
                const currentUser = await User.findOne({ email: user.email });

                if (currentUser) {
                    return true;
                }

                // Create new user
                const newUserData = {
                    providerId: user.id,
                    email: user.email,
                    name: user.name,
                    profilePic: user.image,
                    provider: account.provider
                };

                // Set username based on provider
                if (account.provider === 'github') {
                    newUserData.username = profile.login;
                } else if (account.provider === 'google') {
                    newUserData.username = user.email.split('@')[0];
                }

                await User.create(newUserData);
                return true;

            } catch (error) {
                console.error(`Error in ${account.provider} signIn callback:`, error);
                return false;
            }
        },
        
        async session({ session }) {
            await connectDB();
            
            try {
                const dbUser = await User.findOne({ email: session.user.email });
                if (dbUser) {
                    session.user.username = dbUser.username;
                }
                return session;
            } catch (error) {
                console.error("Error in session callback:", error);
                return session;
            }
        }
    }
});

export { authoptions as GET, authoptions as POST };