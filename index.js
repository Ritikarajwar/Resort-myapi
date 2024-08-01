import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from 'express-fileupload';
import connection, { dbName } from './connection.js';
import { configDotenv } from 'dotenv';

configDotenv(); // Load environment variables

const app = express();
const port = 8052;
let db;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(fileUpload({ useTempFiles: true }));
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    try {
        let data = await db.collection('collection').find({}, { projection: { _id: 0 } }).toArray();
        console.log("Data retrieved from collection:", data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data' });
        console.error("Error retrieving data:", error);
    }
});

app.get('/getdata', async (req, res) => {
    try {
        let data = await db.collection('collection').find({}, { projection: { _id: 0 } }).toArray();
        console.log("Data retrieved from collection:", data);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data' });
        console.error("Error retrieving data:", error);
    }
});

app.post('/adddata', async (req, res) => {
    let name = req.body.name;
    let location = req.body.location;
    let starttime = req.body.starttime;
    let endtime = req.body.endtime;
    let adultfees = req.body.adultfees;
    let childfees = req.body.childfees;
    let currency = req.body.currency;
    let description = req.body.description;

    let images = [];
    if (req.files) {
        if (req.files.image1) {
            try {
                let result = await cloudinary.uploader.upload(req.files.image1.tempFilePath);
                images.push(result.secure_url);
            } catch (err) {
                console.error("Error uploading image 1:", err);
                return res.status(500).send('Error uploading image 1');
            }
        }
        if (req.files.image2) {
            try {
                let result = await cloudinary.uploader.upload(req.files.image2.tempFilePath);
                images.push(result.secure_url);
            } catch (err) {
                console.error("Error uploading image 2:", err);
                return res.status(500).send('Error uploading image 2');
            }
        }
        if (req.files.image3) {
            try {
                let result = await cloudinary.uploader.upload(req.files.image3.tempFilePath);
                images.push(result.secure_url);
            } catch (err) {
                console.error("Error uploading image 3:", err);
                return res.status(500).send('Error uploading image 3');
            }
        }
    }

    try {
        let details = await db.collection('collection').find().toArray();
        let id = details.length ? details.length + 1 : 1;

        let time = {
            starttime,
            endtime
        };
        let fees = {
            adultfees,
            childfees
        };
        let data = { id, name, location, time, fees, currency, description, images };
        await db.collection('collection').insertOne(data);

        res.status(200).json({ message: 'Data added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error storing data' });
        console.error("Error storing data:", error);
    }
});

app.get('/:id', async (req, res) => {
    let id_no = parseInt(req.params.id, 10);
    try {
        let data = await db.collection('collection').find({ id: id_no }, { projection: { _id: 0 } }).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data' });
        console.error("Error retrieving data:", error);
    }
});

connection.then((client) => {
    db = client.db(dbName);
    console.log("Connected to database:", dbName);
    app.listen(port, () => console.log(`Server started on port ${port}`));
}).catch(err => {
    console.error("Failed to connect to database:", err);
});
