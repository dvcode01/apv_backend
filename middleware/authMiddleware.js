import JWT from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            const veterinario = await Veterinario.findById(decoded?.id).select('-password -token -confirmado -createdAt -updatedAt -__v');

            req.veterinario = veterinario;
            return next();
        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json({msg: e.message});
        }
    }

    if(!token){
        const error = new Error('Token no válido o inexistente');
        return res.status(403).json({msg: error.message});
    }

    next();
};

export default checkAuth;