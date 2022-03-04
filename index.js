const express = require('express');
const { MongoClient, Collection } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;



const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("gateknock server is running")
})
app.listen(port, () => {
    console.log("Running port on ", port);
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agixt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);



async function run() {
    try {
        await client.connect();
        console.log('connected successfully!!');
        const database = client.db("GateKnockDB");
        const deliverymansCollection = database.collection("deliverymans");
        const servicesCollection = database.collection("services");
        const ordersCollection = database.collection("orders");

        //-------------------------- Deliveryman API ------------------------------//

        // GET API
        app.get('/deliverymans', async (req, res) => {
            const cursor = deliverymansCollection.find({});
            const deliverymans = await cursor.toArray();
            res.send(deliverymans);
        });

        //POST API
        app.post('/deliverymans', async (req, res) => {
            const deliveryman = req.body;
            console.log(deliveryman);
            const result = await deliverymansCollection.insertOne(deliveryman);
            console.log(result);
            res.json(result)
        });

        //-------------------------- Service API ------------------------------//

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const allServices = await cursor.toArray();
            res.send(allServices);
        });


        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log(service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        });



        //-------------------------- Order API ------------------------------//


        // GET API 

        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        });

        // GET API for any specific Booking

        app.get('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const order = await ordersCollection.findOne(query);
            console.log('loading ordered service with id: ', id);
            res.send(order);
        });

        //POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log(order);
            const result = await ordersCollection.insertOne(order);
            console.log(result);
            res.json(result)
        });

        // DELETE API 
        app.delete("/orders/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        });

        //UPDATE API 
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updatingOrder = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedField = {
                $set: {
                    status: updatingOrder.status
                },
            };
            const result = await ordersCollection.updateOne(filter, updatedField, options)
            console.log('the order status is updated', id)
            res.json(result)
        })





    }
    finally {
        // await client.close();
    }

}
run().catch(console.dir);

