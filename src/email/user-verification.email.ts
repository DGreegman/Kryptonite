import nodemailer from 'nodemailer';

const send_email = async (options: any) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SERVICE,
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // define email options
    const email_options = {
        to: options.email,
        subject: options.subject,
        text: options.message
        // html: `<h1>Thank You!!</h1>`
    };

    await transporter.sendMail(email_options);
};

export default send_email;
