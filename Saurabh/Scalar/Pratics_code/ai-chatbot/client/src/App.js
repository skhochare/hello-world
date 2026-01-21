import React, { useState, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [titleName, setTitleName] = useState("Loading...");

  useEffect(() => {
    fetch("http://localhost:5000/api/config")
      .then((res) => res.json())
      .then((data) => {
        setTitleName(data.title);
        document.title = data.title;
      })
      .catch((err) => {
        console.error(err);
        setTitleName("WeatherInfo AI Chatbot");
      });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    setMessages([...messages, { from: "user", text: input }, { from: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-6">🤖 {titleName}</h1>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg ${
                msg.from === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            className="border flex-1 rounded-l-lg p-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
