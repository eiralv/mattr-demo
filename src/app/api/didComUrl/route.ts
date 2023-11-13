import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    // @ts-ignore
    const host = req.headers.get('host');


    return new Response(`didcomm://https://${host}/api/qr`)
}