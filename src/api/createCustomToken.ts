// app/api/create-custom-token/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { amplifyUserId } = req.body; // Get the Amplify user ID from the request body

    if (!amplifyUserId) {
      return res.status(400).json({ error: "amplifyUserId is required" });
    }

    try {
      const customToken = await firebaseAdmin.auth().createCustomToken(
        "some-uid", // You can use a placeholder UID here, as we're relying on the custom claim
        { amplifyUserId } // Add the Amplify user ID as a custom claim
      );

      res.status(200).json({ customToken });
    } catch (error) {
      console.error("Error creating custom token:", error);
      res.status(500).json({ error: "Failed to create custom token" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
