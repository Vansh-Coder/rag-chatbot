"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import ChatWindow from "@/components/chatWindow";
import { FileUpload } from "@/components/fileUpload";
import { auth } from "../../../firebaseConfig";

export default function Home() {
  // Lifted state holding the array of filenames from the backend
  const [filenames, setFilenames] = useState([]);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [router]);

  if (loading) return <div className="text-orange-500">Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col space-y-4 bg-gray-800 p-4 md:flex-row md:space-x-4 md:space-y-0">
      {/* Upload Section */}
      <section className="flex rounded-lg bg-black shadow md:w-1/3">
        {/* Pass setFilenames as the onChange handler */}
        <FileUpload onChange={setFilenames} idToken={idToken} />
      </section>

      {/* Chat Section */}
      <section className="flex flex-1 flex-col rounded-lg bg-black p-4 shadow">
        {/* hasDocs is true if there’s at least one filename */}
        <ChatWindow hasDocs={filenames.length > 0} idToken={idToken} />
      </section>
    </main>
  );
}
