import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb"
import bcrypt from "bcryptjs";

//var bcrypt = require('bcryptjs');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // limit the handler to a post call

    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    try {
        //extract values from req.body
        const { email, name, password} = req.body 
        console.log(email, name, password);
        //check if an email has been taken
        const existingUser = await prismadb.user.findUnique({
            where: {
                email, //shorthand for email: email.
            }
        });

        if(existingUser) {
            return res.status(422).json({ error: 'Email taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(hashedPassword);

        const user = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }
}