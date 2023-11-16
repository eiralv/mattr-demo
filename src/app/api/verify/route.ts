import { NextApiRequest, NextApiResponse } from "next";
import { verifyCredential } from "./verifyCredential";


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    verifyCredential(req);

    return new Response("OK")
}