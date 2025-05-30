import ChatWindow from "@/components/chatWindow";
import { FileUpload } from "@/components/fileUpload";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col space-y-4 bg-gray-800 p-4 md:flex-row md:space-x-4 md:space-y-0">
      {/* Upload Section */}
      <section className="flex rounded-lg bg-black shadow md:w-1/3">
        <FileUpload />
      </section>

      {/* Chat Section */}
      <section className="flex flex-1 flex-col rounded-lg bg-white p-4 shadow">
        <ChatWindow />
      </section>
    </main>
  );
}
