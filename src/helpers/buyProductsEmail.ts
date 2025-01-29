import nodemailer from "nodemailer";

async function sendEmail(
    username: string,
    email: string,
    productName: string,
    quantity: number,
    address: string
) {
    // Create a transporter using Gmail's SMTP server
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Set up email data
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Order Confirmation",
        text: `Hi ${username},\n\nThank you for your order!\n\nProduct: ${productName}\nQuantity: ${quantity}\nShipping Address: ${address}\n\nYour order will be processed shortly.\n\nBest Regards,\nYour Store`,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log("Confirmation email sent!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export default sendEmail;
