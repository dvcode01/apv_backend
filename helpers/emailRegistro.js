import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    let transporte = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });
    
    const {nombre, email, token} = datos
    
    // Enviar Mail
    const info = await transporte.sendMail({
        from: 'APV - Administrador de Pacientes de Veterinaria',
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `
            <p>Hola ${nombre}! Comprueba tu cuenta de APV.</p>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>

            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        
        `
    });

    console.log('Mensaje enviado: %s', info.messageId);
}

export default emailRegistro;