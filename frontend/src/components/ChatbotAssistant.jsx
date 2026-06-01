import { useState } from "react";

function ChatbotAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("Ask me about menu, deals, delivery, or tracking.");

  const handleSend = () => {
    const text = message.toLowerCase();

    if (text.includes("menu")) {
      setReply("You can open Menu from the top navbar or click Order Now.");
    } else if (text.includes("deal")) {
      setReply("Our deals are available in the Deals section.");
    } else if (text.includes("track")) {
      setReply("Use your tracking number and phone number on the Order Tracking page.");
    } else if (text.includes("delivery")) {
      setReply("Delivery and takeaway both are available.");
    } else {
      setReply("Please contact us for more details.");
    }

    setMessage("");
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">Assistant</div>

      <div className="chatbot-body">
        <p>{reply}</p>

        <input
          type="text"
          placeholder="Type your question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
      </div>
    </div>
  );
}

export default ChatbotAssistant;