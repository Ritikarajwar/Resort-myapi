import{MongoClient} from "mongodb"
import dotenv from "dotenv"

dotenv.config()
console.log(process.env.MONGODB_URI)
const connection = MongoClient.connect(process.env.MONGODB_URI);
export const dbName = "myapi"
export default connection