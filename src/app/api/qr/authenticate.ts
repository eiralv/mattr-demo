import { NextApiRequest } from "next";

export async function getAuthenticationUrl(req: NextApiRequest) {
    // @ts-ignore
    const host = req.headers.get('host');

    const presentationRequest = await createPresentationRequest(host)

    const didUrl = await fetchDIDUrl();

    const jws = await signMessage(presentationRequest.request, didUrl);

    return `https://${process.env.MATTR_TENANT_URLDOMAIN}/?request=${jws}`
}

async function createPresentationRequest(host: string) {
    const response = await fetch(`https://${process.env.MATTR_TENANT_URLDOMAIN}/v2/credentials/web-semantic/presentations/requests`, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            Authorization: `Bearer ${process.env.MATTR_API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "challenge": "GW8FGpP6jhFrl37yQZIM6w",
            "did": process.env.MATTR_VERIFIER_DID,
            "templateId": process.env.MATTR_TEMPLATE_ID,
            "callbackUrl": `https://${host}/api/callback`
        })
    });

    return await response.json();
}

async function fetchDIDUrl() {
    const response = await fetch(`https://${process.env.MATTR_TENANT_URLDOMAIN}/v1/dids/${process.env.MATTR_VERIFIER_DID}`, {
        method: 'GET',
        headers: {
            'Accept': '*/*',
            Authorization: `Bearer ${process.env.MATTR_API_TOKEN}`,
        },
    });

    const data = await response.json();
    return data.didDocument.authentication[0];
}

async function signMessage(presentationRequest: any, didUrl: any) {
    const response = await fetch(`https://${process.env.MATTR_TENANT_URLDOMAIN}/core/v1/messaging/sign`, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            Authorization: `Bearer ${process.env.MATTR_API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "didUrl": didUrl,
            "payload": presentationRequest
        })
    });

    return response.json();
}

