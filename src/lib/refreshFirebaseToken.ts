import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth, 
    // serverAuth
 } from "@/lib/firebase"; // Your Firebase app instance
// import { Auth } from "aws-amplify";

// Queue for requests that need to be retried
let requestQueue: (() => Promise<any>)[] = [];
let isRefreshingToken = false;

// Function to refresh the token
async function refreshFirebaseToken(): Promise<User | null> {
  if (isRefreshingToken) {
    // If already refreshing, wait for it to complete
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (!isRefreshingToken) {
          clearInterval(intervalId);
          resolve(auth.currentUser);
        }
      }, 100);
    });
  }

  isRefreshingToken = true;

  try {
    // 1. Get Amplify User ID
    // const amplifyUser = await Auth.currentAuthenticatedUser();
    const amplifyUser = { attributes: { sub: "example-sub" } }; // Mocked for demonstration
    const amplifyUserId = amplifyUser.attributes.sub;

    // 2. Call API Route to Get Custom Token
    const response = await fetch(
      "http://localhost:3000/api/create-custom-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amplifyUserId }),
      }
    );

    console.log("Response from custom token API:", response.ok);

    if (!response.ok) {
      throw new Error("Failed to get custom token");
    }

    console.log("Response from custom token API:", response);

    const { customToken } = await response.json();

    console.log("Custom token received:", customToken);

    // 3. Sign In with Custom Token
    await signInWithCustomToken(auth, customToken);

    console.log("Firebase token refreshed successfully!");
    return auth.currentUser;
  } catch (error) {
    console.error("Error refreshing Firebase token:", error);
    return null;
  } finally {
    isRefreshingToken = false;
    // Retry queued requests
    requestQueue.forEach((request) => request());
    requestQueue = [];
  }
}

// Function to execute a request, retrying if necessary
export async function executeRequest<T>(request: () => Promise<T>): Promise<T> {
  console.log("Executing request:", request);
  console.log("Current user:", auth.currentUser);
  const user = await refreshFirebaseToken();

  //     if (!auth.currentUser) {
  //     // If not authenticated, queue the request
  //     return new Promise((resolve, reject) => {
  //       requestQueue.push(async () => {
  //         try {
  //           const result = await request();
  //           resolve(result);
  //         } catch (error) {
  //           reject(error);
  //         }
  //       });
  //     });
  //   }

  try {
    return await request();
  } catch (error) {
    // Token might have expired during the request
    console.error("Request failed, attempting to refresh token:", error);
    const user = await refreshFirebaseToken();
    if (user) {
      // Retry the request after refreshing the token
      return await request();
    } else {
      throw new Error("Failed to refresh token and retry request");
    }
  }
}

// 4. Listen for Authentication State Changes
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     console.log("User is signed in:", user.uid);
//     // User is signed in, you can now make storage calls
//   } else {
//     console.log("User is signed out, attempting to refresh token");
//     // User is signed out, attempt to refresh the token
//     await refreshFirebaseToken();
//   }
// });

// Example usage with executeRequest
// async function getFileUrl(amplifyUserId: string, filePath: string) {
//   const storage = getStorage(app);
//   const fileRef = ref(storage, `private/${amplifyUserId}/${filePath}`);
//   return executeRequest(() => getDownloadURL(fileRef));
// }
