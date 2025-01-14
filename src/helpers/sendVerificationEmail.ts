import nodemailer from "nodemailer";

async function sendEmail(
    fullname: string,
    email: string,
    verifyCode: string 
){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const maildata = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification Code",
        text: `Hello ${fullname}, your verification code is: ${verifyCode}\n\n Use this code to complete yopur signup process.`,
    };

    return transporter.sendMail(maildata);
}

export default sendEmail;