import { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    console.log('object');

    return new Response()
}


export async function POST(req: Request, res: NextApiResponse) {
    const request = await req.json();
    const holderDID = request.holder;
    console.log(holderDID);

    return new Response()
}