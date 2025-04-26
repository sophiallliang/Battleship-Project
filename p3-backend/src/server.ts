import app from "./app";
import { connectDB } from "./database/connectDB";
import logger from "./logger/logger";
import { signup } from "./services/auth_service";
import dotenv from 'dotenv'; 
import checkEnv from "./utils/checkEnv";

dotenv.config();

const PORT = process.env.PORT || 8000;

async function startServer() {
    checkEnv();
    
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`😁 Server is running at http://localhost:${PORT}`);
    });
}

startServer();
