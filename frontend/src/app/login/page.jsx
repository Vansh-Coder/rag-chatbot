"use client";
import { useState, useEffect } from "react";
import { auth } from "../../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const router = useRouter();

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
      // login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      console.log("User successfully logged in!");
      router.push("/home");
    } catch (error) {
      console.log("Error occured:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-md rounded-xl border border-white/20 bg-white/10 px-8 py-6 shadow-xl backdrop-blur-sm"
      >
        <h2 className="mb-6 text-center text-3xl font-semibold text-white">
          Login
        </h2>

        <label className="mb-4 block">
          <span className="text-neutral-300">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="mb-4 block">
          <span className="text-neutral-300">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-2 font-semibold tracking-wide text-white transition hover:bg-blue-700 disabled:opacity-50"
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

        <p className="mt-6 text-center text-base text-neutral-400">
          <Link href="/signup" className="text-blue-400 hover:underline">
            or Signup
          </Link>
        </p>
      </form>
    </div>
  );
}
