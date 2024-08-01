import express, { json } from "express"
import cors from "cors"
import { v2 as cloudinary } from 'cloudinary'
import fileUpload from "express-fileupload"
import connection, { dbName } from "./connection.js"
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 8052;
let db



app.use(express.json());
app.use(cors({ origin: "*" }))
app.use(fileUpload({ useTempFiles: true }))
app.use(express.urlencoded({ extended: false }))

app.get('/',async(req,res)=>{

    try{
            let data = await db.collection('collection').find({}, { projection: { _id: 0 } }).toArray()
            console.log("Data retrieved from collection:", data)
            res.status(200).json(data)
        }
        catch(error){
        res.status(500).json({error})
        console.error("Error retrieving data:", error)
        }


})

app.post('/', async (req, res) => {
    // console.log(req.body)
    let name = req.body.name
    let location = req.body.location
    let starttime = req.body.starttime
    let endtime = req.body.endtime
    let adultfees = req.body.adultfees
    let childfees = req.body.childfees
    // let currency = "INR"
    let currency = req.body.currency
    let description = req.body.description

    let id 
    console.log(req.files)

    let images = []
    if (req.files) {
        if (req.files.image1) {
            try{
                let result = await cloudinary.uploader.upload(req.files.image1.tempFilePath)
                images.push(result.secure_url)
            }catch (err) {
                console.error("Error uploading image 1:", err)
                return res.status(500).send(JSON.stringify('Error uploading image 1'))
            }
         console.log(images+"line 56")
        }
        if (req.files.image2) {
            let result = await cloudinary.uploader.upload(req.files.image2.tempFilePath)
            images.push(result.secure_url)
        }
        if (req.files.image2) {
            let result = await cloudinary.uploader.upload(req.files.image3.tempFilePath)
            images.push(result.secure_url)
        }
    }
    // console.log(images)

    try{
        let details = await db.collection('collection').find().toArray()
        // console.log(details)
        // console.log(details.length + 1 )

        if(details==''){
            // let id = 1
            id = 1
            // console.log(id)
        }
        else{
            id = details.length + 1
        }
    }catch{

    }
    
    try {
        let time = {
            starttime:starttime,
            endtime:endtime
        }
        let fees = {
            adultfees:adultfees,
            childfees:childfees
        }
        let data = {id,name,location,time,fees,currency,description,images}
        let details = await db.collection('collection').insertOne(data)
        // console.log(id)
<<<<<<< HEAD
       
=======
         // res.send(json(details))
>>>>>>> 7ecbc43628f0f11f3e82cb4e74d691d4851d2218
    }
    catch (error) {
        res.status(500).json({ error })
        console.error("Error storing data:", error)
    }


})

app.get('/:id', async(req,res)=>{
    let id_no = req.url.split('')[1]
    console.log(Number(id_no))
    let data = await db.collection('collection').find({id:Number(id_no)},{ projection: { _id: 0 } }).toArray()
    
    res.send(data)
    
  })
connection.then((client) => {
    db = client.db(dbName)
    console.log("Connected to database:", dbName)
    app.listen(port, () => console.log(port + " started"))
}).catch(err => {
    console.error("Failed to connect to database:", err)
})
