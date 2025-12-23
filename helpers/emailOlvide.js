import nodemailer from 'nodemailer';

const emailOlvide = async (datos) => {
    let transporte = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    const {nombre, email, token} = datos;
    
    // Enviar Mail
    const info = await transporte.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Reestablece tu password',
        text: 'Reestablece tu password',
        html: `
            <p>Hola ${nombre}! Haz solicitdo reestablecer el password.</p>
            <p>Sigue el siguiente enlace para generar un nuevo password:
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        
        `
    });

    console.log('Mensaje enviado: %s', info.messageId);
}

export default emailOlvide;