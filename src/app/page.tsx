import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const HomePage = async () => {
  // const { userId } = auth();
  const { userId } = { userId: "example-sub" }; // Mocked userId for testing

  if (userId) return redirect("/locker");
};

export default HomePage;
