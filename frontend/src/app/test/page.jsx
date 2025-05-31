export default function Home() {
  const data = [
    { key: 1, content: "This is a random content sentence." },
    { key: 2, content: "This is a random content sentence." },
    { key: 3, content: "This is a random content sentence." },
    { key: 4, content: "This is a random content sentence." },
    { key: 5, content: "This is a random content sentence." },
    { key: 6, content: "This is a random content sentence." },
    { key: 7, content: "This is a random content sentence." },
    { key: 8, content: "This is a random content sentence." },
    { key: 9, content: "This is a random content sentence." },
    { key: 10, content: "This is a random content sentence." },
    { key: 11, content: "This is a random content sentence." },
    { key: 12, content: "This is a random content sentence." },
  ];

  return (
    <div className="flex h-[80vh] flex-1 flex-col rounded-lg bg-gray-400 p-4 shadow">
      <div className="border border-black">Hello</div>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto border border-black p-2">
        {data.map((d, index) => (
          <div
            key={index}
            className="max-w-[90%] self-start rounded bg-gray-200 p-2 text-left"
          >
            {d.content}
          </div>
        ))}
      </div>
      <div className="border border-black">Ok</div>
    </div>
  );
}
