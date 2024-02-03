import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";

import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

// var bcrypt = require('bcryptjs');

export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || ''
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                }
            },
            async authorize(credentials) {
                // if email and name is missing, throw an error
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }
                // defined at global.d.ts file
                //check whether user exists
                const user = await prismadb.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if(!user || !user.hashedPassword) {
                    throw new Error('Email does not exits');
                } // if the user not exsit throw err

                //check whether user written password is correct
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password, 
                    user.hashedPassword
                );

                if(!isCorrectPassword) {
                    throw Error('Incorrect password')
                } //if the pwd is incorrect throw err

                return user;

            }
        })
    ],
    pages: {
        signIn: '/auth' //define SignIn page would be auth.tsx
    },

    debug: process.env.NODE_ENV === 'development',
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: 'jwt',
    },
    jwt: { // AN OBJECT
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);