// client-side code (e.g., in a component)
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import your Firebase app instance
// import { Auth } from "aws-amplify";

export async function signInWithAmplifyUserId() {
  try {
    // 1. Get Amplify User ID
    // const amplifyUser = await Auth.currentAuthenticatedUser();
    const amplifyUser = { attributes: { sub: "example-sub" } }; // Mocked for demonstration

    const amplifyUserId = amplifyUser.attributes.sub; // Assuming 'sub' is the user ID attribute

    // 2. Call API Route to Get Custom Token
    const response = await fetch("/api/create-custom-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amplifyUserId }),
    });

    if (!response.ok) {
      throw new Error("Failed to get custom token");
    }

    const { customToken } = await response.json();

    // 3. Sign In with Custom Token
    await signInWithCustomToken(auth, customToken);

    console.log("Signed in with custom token successfully!");
  } catch (error) {
    console.error("Error signing in with custom token:", error);
  }
}
