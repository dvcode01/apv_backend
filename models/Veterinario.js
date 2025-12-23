import mongoose from "mongoose";
import argon2 from 'argon2';
import { randomUUID } from 'crypto';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: '',
        trim: true
    },
    web:{
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: randomUUID()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

veterinarioSchema.pre('save', async function(next){
    /*if(!this.isModified('password')){
        next();
    }*/

    this.password = await argon2.hash(this.password);
});

veterinarioSchema.methods.comprobarPassword = async function(passwordForm) {
    return await argon2.verify(this.password, passwordForm);
};

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;









