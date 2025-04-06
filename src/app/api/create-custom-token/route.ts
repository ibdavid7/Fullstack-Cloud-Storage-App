// pages/api/createCustomToken.ts
import { NextRequest, NextResponse } from "next/server";
import { firebaseAdmin } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {

    console.log("API route /api/create-custom-token hit!"); // Log when the route is hit

    console.log("Received request:", req);

    const body = await req.json();
    console.log("Received body:", body);
    
    const { amplifyUserId } = body;

    if (!amplifyUserId) {
      return NextResponse.json(
        { error: "amplifyUserId is required" },
        { status: 400 }
      );
    }

    console.log("Received amplifyUserId:", amplifyUserId);
    // Create a custom token using Firebase Admin SDK
    // This token can include custom claims, such as the Amplify user ID
    // You can also set other claims as needed
    // For example, you can set the user's role or permissions

    const customToken = await firebaseAdmin.auth().createCustomToken(
      "some-uid", // You can use a placeholder UID here, as we're relying on the custom claim
      { amplifyUserId } // Add the Amplify user ID as a custom claim
    );

    console.log("Custom token created:", customToken);

    return NextResponse.json({ customToken });
  } catch (error) {
    console.error("Error creating custom token:", error);
    return NextResponse.json(
      { error: "Failed to create custom token", details: error }, // Include error details
      { status: 500 }
    );
  }
}
