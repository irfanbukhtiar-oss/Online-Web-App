import { useState } from "react";
import { Link } from "react-router-dom";

function ChatbotAssistant() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState(
    "Assalam o Alaikum! Ask me about menu, deals, delivery, payment, or order tracking."
  );

  const handleSend = () => {
    const text = message.toLowerCase();

    if (!text.trim()) return;

    if (
      text.includes("track") ||
      text.includes("tracking") ||
      text.includes("order status") ||
      text.includes("where is my order")
    ) {
      setReply(
        "To track your order, open Order Tracking and enter your tracking number or WhatsApp number."
      );
    } else if (text.includes("menu") || text.includes("food")) {
      setReply("You can view all menu items from the Menu section.");
    } else if (text.includes("deal") || text.includes("offer")) {
      setReply("You can view current deals from the Deals section.");
    } else if (text.includes("delivery")) {
      setReply(
        "Delivery is available. Please enter your address or Google location during checkout."
      );
    } else if (text.includes("takeaway")) {
      setReply("Takeaway is available. Select Takeaway during checkout.");
    } else if (text.includes("dine") || text.includes("dine-in")) {
      setReply("Dine-in is available. Select Dine-in during checkout.");
    } else if (
      text.includes("payment") ||
      text.includes("cod") ||
      text.includes("qr") ||
      text.includes("card")
    ) {
      setReply(
        "Payment options are COD, Card Payment, and QR Scan for online payment."
      );
    } else if (text.includes("phone") || text.includes("whatsapp")) {
      setReply("You can contact Broast Chasers on WhatsApp: 0307-111-78-69.");
    } else if (text.includes("time") || text.includes("open")) {
      setReply("Broast Chasers timing is 5:00 PM to 2:00 AM.");
    } else if (text.includes("address") || text.includes("location")) {
      setReply("Address: 6/A Shalimar Link Road Lahore.");
    } else {
      setReply(
        "I can help with menu, deals, delivery, payment, contact, and order tracking."
      );
    }

    setMessage("");
  };

  return (
    <div className="chatbot">
      <div className="chatbot-header">Broast Chasers Assistant</div>

      <div className="chatbot-body">
        <p>{reply}</p>

        {reply.includes("Order Tracking") && (
          <Link to="/track-order">
            <button className="secondary-btn chatbot-link-btn">
              Open Order Tracking
            </button>
          </Link>
        )}

        <input
          type="text"
          placeholder="Ask about order tracking..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button className="primary-btn chatbot-send-btn" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatbotAssistant;