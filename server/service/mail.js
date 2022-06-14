const nodemailer = require('nodemailer')

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivatorMail(to, activatorLink) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта в hclub',
            text: '',
            html: `
            <h1>Для активации аккаунта перейдите по ссылке</h1>
            <a href='${process.env.API_URL}/api/user/activate/${activatorLink}'>Тык</a>
            `
        })
    }
}

module.exports = new MailService()