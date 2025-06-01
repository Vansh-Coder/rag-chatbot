"use client";

import { useState, useEffect, useRef } from "react";
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

  // Keep a ref to the current logout timer ID so it can be reset/cleared
  const logoutTimerRef = useRef(null);

  // 10 minutes in milliseconds
  const INACTIVITY_LIMIT = 10 * 60 * 1000;

  // Function to actually sign out and redirect
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error signing out:", e);
    } finally {
      router.push("/login");
    }
  };

  // Timer management
  const startLogoutTimer = () => {
    clearLogoutTimer();
    logoutTimerRef.current = setTimeout(() => {
      handleSignOut();
    }, INACTIVITY_LIMIT);
  };

  const clearLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  // Whenever user does something, reset the timer
  const resetLogoutTimer = () => {
    startLogoutTimer();
  };

  // Set up/tear down event listeners for activity
  const activityEvents = [
    "mousemove",
    "keydown",
    "mousedown",
    "touchstart",
    "scroll",
  ];

  const registerActivityListeners = () => {
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetLogoutTimer);
    });
  };

  const cleanupActivityListeners = () => {
    activityEvents.forEach((evt) => {
      window.removeEventListener(evt, resetLogoutTimer);
    });
  };

  // Listen for Firebase Auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setIdToken(token);
        startLogoutTimer(); // Start the inactivity timer as soon as the user is logged in
        registerActivityListeners(); // Register event listeners to reset that timer on any activity
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      cleanupActivityListeners();
      clearLogoutTimer();
    };
  }, [router]);

  if (loading)
    return <div className="text-center font-bold text-white">Loading...</div>;

  return (
    <main className="flex h-full flex-1 flex-col space-y-4 bg-gray-800 p-4 md:flex-row md:space-x-4 md:space-y-0">
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
