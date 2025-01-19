import nodemailer from "nodemailer";

async function sendEmail(
    name: string,
    email: string,
    code: number
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
        subject: "Email Verification Code",
        text: `Hello ${name},\n\nYour verification code is: ${code}\n\nPlease use this code to complete your signup process.`, // Plain text body
    };

    // Send the email
    return transporter.sendMail(mailOptions);
}

export default sendEmail;