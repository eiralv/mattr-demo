import { NextApiRequest, NextApiResponse } from "next";
import { getAuthenticationUrl } from "./authenticate";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    console.log('Authenticating');
    const url = await getAuthenticationUrl(req);

    console.log(url);
    return Response.redirect(url, 302);
}