"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SignupForm({ className }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form logic (API call, validation, etc.)
    console.log("Form submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("mx-auto max-w-md rounded-md bg-white p-6 shadow-md", className)}
    >
      <h2 className="mb-4 text-2xl font-bold">Sign Up</h2>

      <label className="mb-2 block">
        <span className="text-gray-700">First name</span>
        <input
          type="text"
          name="fName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="mb-2 block">
        <span className="text-gray-700">Last name</span>
        <input
          type="text"
          name="lName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="mb-2 block">
        <span className="text-gray-700">Email</span>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <label className="mb-2 block">
        <span className="text-gray-700">Password</span>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </label>

      <button
        type="submit"
        className="mt-2 rounded-md bg-blue-600 px-5 py-2 text-white w-full font-semibold tracking-wide transition hover:bg-blue-700"
      >
        Confirm
      </button>
    </form>
  );
}
