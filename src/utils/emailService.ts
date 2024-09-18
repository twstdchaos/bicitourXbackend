import nodemailer from "nodemailer";
import logger from '../utils/logger';
import { MAIL, PASSWORD } from "./config";

export const sendEmail = async (to: string, subject: string, text: string) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: MAIL,
            pass: PASSWORD,
        },
    });

    const mailOptions = {
        from: MAIL,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Email enviado a ${to}`);
    } catch (error) {
        logger.error(`Error al enviar el email a ${to}:`, error);
    }
};