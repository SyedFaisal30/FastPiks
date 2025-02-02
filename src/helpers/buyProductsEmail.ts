import nodemailer from "nodemailer";

async function sendEmail(
  username: string,
  email: string,
  productName: string,
  quantity: number,
  address: string,
  price: number // Added price as a parameter to calculate subtotal and total
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials are missing.");
    return;
  }

  // Calculate subtotal and total
  const subtotal = price * quantity;
  const total = subtotal; // Assuming no additional charges (e.g., tax, shipping)
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Order Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Order Confirmation</h2>
        <p>Hi <strong>${username}</strong>,</p>
        <p>Thank you for your order!</p>
        <h3>Order Details:</h3>
        <ul>
          <li><strong>Product:</strong> ${productName}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Shipping Address:</strong> ${address}</li>
          <li><strong>Subtotal:</strong> ₹${subtotal}</li>
          <li><strong>Total:</strong> ₹${total}</li>
        </ul>
        <p>Your order will be processed shortly and delivered to you within 3 working days.</p>
        <br>
        <p>Best Regards,<br>Your Store</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default sendEmail;
