import{MongoClient} from "mongodb"
import dotenv from "dotenv"

dotenv.config()

const connection = MongoClient.connect(process.env.MONGODB_URI);
export const dbName = "myapi"
export default connection