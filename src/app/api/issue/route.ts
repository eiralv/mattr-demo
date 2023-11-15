import { NextApiRequest, NextApiResponse } from "next";
import { issueCredential } from "./issueCredential";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    issueCredential();

    return new Response("OK")
}