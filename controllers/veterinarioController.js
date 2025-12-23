import { randomUUID } from 'crypto';
import Veterinario from '../models/Veterinario.js'
import generarJWT from '../helpers/generarJWT.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvide from '../helpers/emailOlvide.js';

const registrar = async (req, res) => {
    const { email, nombre, } = req.body;

    // Prevenir registros duplicados
    const existeUsuario = await Veterinario.findOne({email});
    
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }

    try {
        // Guardar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar email
        emailRegistro({email, nombre, token: veterinarioGuardado.token});

        res.json(veterinarioGuardado);
    } catch (error) {
        console.error(error);
    }
}

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Veterinario.findOne({ token });

    if(!usuarioConfirmar){
        const error = new Error('Token no válido');
        return res.status(404).json({msg: error.message});
    }
    
    try {
        // eliminar token y cambiar confirmado
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario confirmado correctamente'});
    } catch (error) {
        console.error(error);
    }
}

const autenticar = async(req, res) => {
    const { email, password } = req.body;
    const usuario = await Veterinario.findOne({email});

     // Existe usuario
    if(!usuario){
        const error = new Error('Usuario no existe');
        return res.status(404).json({msg: error.message});
    }

    // Usuario confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    // Revisar Password
    if(await usuario.comprobarPassword(password)){
        // Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    }else{
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message});
    }
}

const olvidePassword = async(req, res) => {
    const { email } = req.body;
    const existeVeterinario = await Veterinario.findOne({email});
    
    if(!existeVeterinario){
        const error = new Error('El Usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = randomUUID();
        await existeVeterinario.save();

        // Envio de email con instrucciones
        emailOlvide({
            email, 
            nombre: existeVeterinario.nombre, 
            token: existeVeterinario.token
        });


        res.json({msg: 'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.error(error);
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido){
        res.json({msg: 'Token valido y el usuario existe'});
    }else{
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }

}

const nuevoPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const veterinario = await Veterinario.findOne({token});

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;

        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'});
    } catch (error) {
        console.error(error);
    }
}

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
}

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    const { email } = req.body;

    if(veterinario.email !== email){
        const existeEmail = await Veterinario.findOne({email});

        if(existeEmail){
            const error = new Error('Email ya esta en uso');
            return res.status(400).json({msg: error.message});
        }
    }

    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.telefono = req.body.telefono;
    veterinario.web = req.body.web;

    try {
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.error(error);
    }
};

const actualizarPassword = async (req, res) => {
    const { _id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;
    const usuario = await Veterinario.findOne({ _id });

    if(!usuario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    if(await usuario.comprobarPassword(pwd_actual)){
        usuario.password = pwd_nuevo;
        await usuario.save();

        res.json({msg: 'Password Actualizado Correctamente'});
    }else{
        const error = new Error('Password Actual Incorrecto');
        return res.status(400).json({msg: error.message});
    }
};

export {
    registrar,
    perfil, 
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}