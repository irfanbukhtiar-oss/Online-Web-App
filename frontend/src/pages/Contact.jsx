function Contact() {
  const address = "6/A Shalimar Link Road Lahore";
  const mapQuery = encodeURIComponent(address);

  return (
    <div className="form-page">
      <h2>Contact Us</h2>

      <div className="card contact-card">
        <p>
          <strong>Restaurant:</strong> Broast Chasers
        </p>

        <p>
          <strong>Phone / WhatsApp:</strong>{" "}
          <a href="tel:03071117869">0307-111-78-69</a>
        </p>

        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:broastchasers@gmail.com">
            broastchasers@gmail.com
          </a>
        </p>

        <p>
          <strong>Address:</strong> 6/A Shalimar Link Road Lahore
        </p>

        <p>
          <strong>Timing:</strong> 5:00 PM to 2:00 AM
        </p>

        <div className="map-actions">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            <button className="primary-btn">Open in Google Maps</button>
          </a>
        </div>

        <div className="google-map-box">
          <iframe
            title="Broast Chasers Location"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            width="100%"
            height="360"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Contact;