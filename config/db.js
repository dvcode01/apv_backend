import mongoose from "mongoose";

const connectionDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        const db = await mongoose.connect(uri);

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }

};

export default connectionDB;