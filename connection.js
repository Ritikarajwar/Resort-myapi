import{MongoClient} from "mongodb"
// import dotenv from "dotenv"

// dotenv.config()

const connection = MongoClient.connect("mongodb+srv://ritikarajwar0:11223344@cluster0.u2mqpbq.mongodb.net/myapi?retryWrites=true&w=majority&appName=Cluster0 ");
export const dbName = "myapi"
export default connection