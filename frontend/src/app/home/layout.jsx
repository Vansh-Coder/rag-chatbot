import Navbar from "@/components/navbar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
