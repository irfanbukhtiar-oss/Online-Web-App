import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import ChatbotAssistant from "../components/ChatbotAssistant";

function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <img src={logo} alt="Broast Chasers Logo" className="hero-logo" />
          <h1>Broast Chasers</h1>
          <p>
            Fresh broast, crispy burgers, loaded fries, family deals,
            takeaway and delivery.
          </p>
          <Link to="/menu-deals">
            <button className="primary-btn">Order Now</button>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Featured Menu Items</h2>

        <div className="grid">
          <div className="card">
            <h3>Chicken Broast</h3>
            <p>Crispy golden broast with special seasoning.</p>
            <p className="price">Rs. 650</p>
          </div>

          <div className="card">
            <h3>Zinger Burger</h3>
            <p>Spicy crispy chicken burger with sauce.</p>
            <p className="price">Rs. 450</p>
          </div>

          <div className="card">
            <h3>Loaded Fries</h3>
            <p>Fries loaded with chicken, sauce and spices.</p>
            <p className="price">Rs. 350</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Deals & Promotions</h2>

        <div className="grid">
          <div className="card">
            <h3>Deal 1</h3>
            <p>1 Chicken Broast + Fries + Drink</p>
            <p className="price">Rs. 899</p>
          </div>

          <div className="card">
            <h3>Family Deal</h3>
            <p>4 Broast Pieces + 4 Drinks + Fries</p>
            <p className="price">Rs. 2499</p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Delivery / Takeaway</h2>
        <div className="card">
          <p>
            Choose delivery or takeaway at checkout. For delivery orders,
            enter your complete address and phone number.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>Contact</h2>
        <div className="card">
          <p>Phone: 0300-0000000</p>
          <p>Address: Your Restaurant Address</p>
        </div>
      </section>

      <ChatbotAssistant />
    </>
  );
}

export default Home;