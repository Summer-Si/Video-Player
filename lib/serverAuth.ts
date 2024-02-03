import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prismadb from '@/lib/prismadb';
import { authOptions } from "@/pages/api/auth/[...nextauth]";


// use serverAuth in API controller, to check whether we are logging
//going to pass the request paremeter to hold the jwt token
//which getSession can then use to get our login user.
const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    //fetch our logged in user session. req: obeject to accept request
    const session = await getServerSession( req, res, authOptions );
    //if session or user or email doesn't exits
    if(!session?.user?.email) {
        throw new Error('Not signed in');
    }
    // if exists, fecth current user
    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        }
    });

    if(!currentUser) {
        throw new Error('Not signed in');
    }

    return {currentUser}; // return object
};

export default serverAuth;