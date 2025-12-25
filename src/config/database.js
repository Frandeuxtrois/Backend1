const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://frandeuxtrois:mariana11@cluster0.sgi4u4e.mongodb.net/?appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('conectado a mongodb');
    } catch (error) {
        console.error('error al conectar mongodb', error);
        process.exit(1);
    }
};

module.exports = connectDB;