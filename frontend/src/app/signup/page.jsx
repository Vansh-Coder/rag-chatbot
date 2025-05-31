"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Health-check ping to wake the backend as soon as the page loads
  useEffect(() => {
    // Response doesn't matter
    fetch(`${BACKEND_URL}/`)
      .then(() => {
        console.log("Backend pinged to wake it up");
      })
      .catch((err) => {
        console.warn("Backend ping failed (backend might still be down):", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // signup
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      // save additional info
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date(),
      });
      console.log("User signed up and profile saved!");
      router.push("/home");
    } catch (error) {
      console.log("Error occured:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-md rounded-md bg-white p-6 shadow-md"
      >
        <h2 className="mb-4 text-center text-2xl font-bold">Sign Up</h2>

        <label className="mb-2 block">
          <span className="text-gray-700">First name</span>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="mb-2 block">
          <span className="text-gray-700">Last name</span>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="mb-2 block">
          <span className="text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <label className="mb-2 block">
          <span className="text-gray-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-2 font-semibold tracking-wide text-white transition hover:bg-blue-700"
        >
          {loading && (
            <svg
              className="-ml-1 mr-3 size-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {loading ? "Loading..." : "Confirm"}
        </button>
      </form>
    </div>
  );
}
