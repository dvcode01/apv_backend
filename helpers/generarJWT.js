import JWT from "jsonwebtoken";

const generarJWT = (id) => {
    return JWT.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

export default generarJWT;