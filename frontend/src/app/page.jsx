import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { IoLogoGithub } from "react-icons/io5";
import MovingBorderButton from "@/components/ui/movingBorderButton";

export default function Home() {
  return (
    <div className="relative z-0">
      {/* Fake background that covers over-scroll areas */}
      <div className="fixed inset-0 -z-10 bg-black" />
      <div className="fixed bg-black" />

      {/* Floating button in the top-right linking to the GitHub repo */}
      <a
        href="https://github.com/Vansh-Coder/rag-chatbot"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-5 top-5 z-20 rounded-full bg-neutral-800 p-1 text-neutral-100 hover:bg-neutral-700 hover:text-white"
      >
        <IoLogoGithub className="h-9 w-9" />
      </a>

      <div className="relative flex h-screen w-full overflow-hidden bg-black/[0.96] antialiased md:items-center md:justify-center">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 select-none [background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
          )}
        />
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
          <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
            EduBot <br /> Your AI ChatBot for Study.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
            EduBot is a great way to chat with your course material, literally!
            Simply upload your study documents and ask the chatbot any
            questions. Start your study journey with EduBot now!
          </p>
          <div className="mt-6 flex justify-center">
            <MovingBorderButton label="Signup" path="/signup" />
            <MovingBorderButton label="Login" path="/login" />
          </div>
        </div>
      </div>
    </div>
  );
}
