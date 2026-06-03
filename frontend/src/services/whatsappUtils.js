export const formatWhatsAppNumber = (phone) => {
  if (!phone) return "";

  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "92" + cleaned.substring(1);
  }

  if (!cleaned.startsWith("92")) {
    cleaned = "92" + cleaned;
  }

  return cleaned;
};

export const createOrderConfirmationMessage = (order) => {
  return encodeURIComponent(
`Assalam o Alaikum ${order.customer_name},

Your order has been received by Broast Chasers.

Order Number: ${order.order_number}
Tracking Number: ${order.tracking_number}
Status: ${order.status}
Order Type: ${order.order_type}
Total Amount: Rs. ${order.total_amount}

You can track your order using your tracking number or WhatsApp number.

Thank you for ordering from Broast Chasers.`
  );
};

export const createStatusUpdateMessage = (order) => {
  return encodeURIComponent(
`Assalam o Alaikum ${order.customer_name},

Your Broast Chasers order status has been updated.

Order Number: ${order.order_number}
Tracking Number: ${order.tracking_number}
Current Status: ${order.status}

Thank you.`
  );
};

export const openWhatsAppMessage = (phone, message) => {
  const number = formatWhatsAppNumber(phone);
  const url = `https://wa.me/${number}?text=${message}`;

  window.open(url, "_blank");
};