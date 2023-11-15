export async function issueCredential() {
  const credential = await createCredential();
  const messaage = await encryptCredential(credential);
  await sendMessage(messaage);
}

async function createCredential() {
  const issuerDid = process.env.MATTR_ISSUER_DID;
  const credentialSubjectDID = process.env.MATTR_WALLET_DID;

  const response = await fetch(
    `https://${process.env.MATTR_TENANT_URLDOMAIN}/v2/credentials/web-semantic/sign`,
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${process.env.MATTR_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        payload: {
          "@context": ["https://schema.org"],
          name: "Course credential",
          description: "Course credential description",
          type: ["CourseCredential"],
          credentialSubject: {
            id: credentialSubjectDID,
            givenName: "Bob",
            familyName: "Dylan",
            educationalCredentialAwarded: "Certificate Name",
          },
          issuer: {
            id: issuerDid,
            name: "tenant",
          },
          expirationDate: "2024-02-07T06:44:28.952Z",
        },
        proofType: "Ed25519Signature2018",
        tag: "identifier123",
        persist: false,
        revocable: false,
      }),
    }
  );

  return await response.json();
}
async function encryptCredential(credential: any) {
  const senderDidURL = process.env.MATTR_SENDERDID_URL;
  const cred = credential.credential;
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
        payload: {
          id: "75fdda99-9b23-4b02-bad7-e78f6a4f6a1d",
          type: "https://mattr.global/schemas/verifiable-credential/offer/Direct",
          to: [credentialSubjectDID],
          from: process.env.MATTR_ISSUER_DID,
          created_time: 1624509675690,
          body: {
            credentials: [ cred ],
            domain: `${process.env.MATTR_TENANT_URLDOMAIN}`,
          },
        },
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
        message: message.jwe,
      }),
    }
  );

  return response;
}