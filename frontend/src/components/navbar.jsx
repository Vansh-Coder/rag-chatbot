"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Navbar() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("to EduBot");

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  useEffect(() => {
    const fetchFirstName = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setFirstName(userData.firstName);
      } else {
        console.log("No such user document!");
      }
    };

    fetchFirstName();
  }, []);

  return (
    <div className="flex w-full items-center justify-between bg-gray-900 p-4 text-white">
      <h1 className="text-xl font-semibold tracking-wider">
        Welcome {firstName}!
      </h1>
      <button
        onClick={handleLogout}
        className="rounded bg-red-500 px-4 py-2 tracking-wide transition hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
