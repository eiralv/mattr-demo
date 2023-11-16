import { NextApiRequest } from "next";

export async function verifyCredential(req: NextApiRequest) {
  console.log("hello");

  // @ts-ignore
  const host = req.headers.get("host");

  const presentationRequest = await createPresentationRequest(host);
  const encryptedMessage = await encryptMessage(presentationRequest);
  sendMessage(encryptedMessage);
}

async function createPresentationRequest(host: string) {
  const response = await fetch(
    `https://${process.env.MATTR_TENANT_URLDOMAIN}/v2/credentials/web-semantic/presentations/requests`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${process.env.MATTR_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        challenge: "GW8FGpP6jhFrl37yQZIM6w",
        did: process.env.MATTR_ISSUER_DID,
        templateId: "5fbab917-40f2-4159-89c1-7836e7957bb0",
        callbackUrl: `https://${host}/api/callback`,
      }),
    }
  );

  return await response.json();
}

async function encryptMessage(presentationRequest: any) {
  const senderDidURL = process.env.MATTR_SENDERDID_URL;
  const credentialSubjectDID = process.env.MATTR_WALLET_DID;
  
  const response = await fetch(
    `https://${process.env.MATTR_TENANT_URLDOMAIN}/v1/messaging/encrypt`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${process.env.MATTR_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderDidUrl: senderDidURL,
        recipientDidUrls: [credentialSubjectDID],
        payload: presentationRequest.request,
      }),
    }
  );

  return await response.json();
}

async function sendMessage(message: any) {
  const response = await fetch(
    `https://${process.env.MATTR_TENANT_URLDOMAIN}/v1/messaging/send`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${process.env.MATTR_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: process.env.MATTR_WALLET_DID,
        message: message.jwe
      }),
    }
  );

  return response;
}