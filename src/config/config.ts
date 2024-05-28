import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const CONNECTION_STRING = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.iec4oco.mongodb.net/Kryptonite`

const connect_db = async() => {
    try {
        await mongoose.connect(CONNECTION_STRING)
        .then((connected) => console.log(`Database Connected ${connected.connection.name} ${connected.connection.host}`))
        
    } catch (error: unknown | any) {
        console.log(error.name, error.message)
    }
}

export default connect_db