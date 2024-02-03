import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/lib/serverAuth";

//handler accept a request/response which is type of NextApiRequest/response
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    //limit the function to only get request
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const { currentUser}  = await serverAuth(req, res);//check if this current user exists first

        return res.status(200).json(currentUser);
    } catch (error) {
        console.log(error);
        return res.status(400).end();
    }   
}

