import{MongoClient} from "mongodb"
import dotenv from "dotenv"

dotenv.config()
console.log("MongoDB URI:", process.env.MONGODB_URI);
// console.log(process.env.connection)
const connection = MongoClient.connect(process.env.MONGODB_URI);
export const dbName = "myapi"
export default connection