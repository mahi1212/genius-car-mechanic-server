const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId 
require('dotenv').config()

const app = express()
const port = 5000

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tecyb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log('Connected to database')
        const database = client.db('carMechanic')
        const serviceCollection = database.collection('services')

        // GET API
        app.get('/services', async(req,res)=>{
            const cursor = serviceCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        } )

        // GET SINGLE SERVICE 
        app.get('/services/:id', async(req,res)=>{
            const id = req.params.id
            console.log("getting id", id)
            const query = { _id : ObjectId(id)} // Do not use "=" instead of ":"
            const service = await serviceCollection.findOne()
            res.json(service)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('hit the api', service) 
            // res.send('Post hitted')
            const result = await serviceCollection.insertOne(service)
            res.json(result)
            // console.log(result)
        })

        // DELETE API 
        app.delete('/services/:id', async(req,res)=>{ //Use Slesh before colon ":"
            const id = req.params.id
            const query = {_id : ObjectId(id)}
            const result = await serviceCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Running genius server')
})

app.listen(port, () => {
    console.log('Running on port ', port)
})