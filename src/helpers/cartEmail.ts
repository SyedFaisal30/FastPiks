import nodemailer from "nodemailer";

async function sendCartEmail(
  username: string,
  email: string,
  products: Array<any>,  // Array of products in the cart
  address: string,
  totalAmount: number
) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Email credentials are missing.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let productDetails = "";
  products.forEach((product) => {
    productDetails += `
      <tr>
        <td>${product.productname}</td>
        <td>${product.quantity}</td>
        <td>${product.price}</td>
        <td>${product.subtotal}</td>
      </tr>
    `;
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Cart Order Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #4CAF50;">Cart Order Confirmation</h2>
        <p>Hi <strong>${username}</strong>,</p>
        <p>Thank you for your order from your cart!</p>
        <h3>Order Details:</h3>
        <table style="width: 100%; border: 1px solid #ccc; border-collapse: collapse;">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${productDetails}
          </tbody>
        </table>
        <p><strong>Total Amount:</strong> ${totalAmount}</p>
        <p><strong>Shipping Address:</strong> ${address}</p>
        <p>Your order will be processed and delivered within 3 working days.</p>
        <br>
        <p>Best Regards,<br>FirstPiks</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Cart order confirmation email sent!");
  } catch (error) {
    console.error("Error sending cart order email:", error);
  }
}

export default sendCartEmail;
