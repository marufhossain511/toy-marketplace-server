const express = require('express');
const cors = require('cors');
const app=express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;
require('dotenv').config()

// middleware
app.use(express.json())
app.use(cors())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vvlmqn2.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const shopCollection=client.db("shopDB").collection("toys")


    app.post('/allToys', async(req,res)=>{
      const newToy=req.body
      console.log(newToy);
      const result = await shopCollection.insertOne(newToy)
      res.send(result)
    })

    app.get('/allToys', async(req,res)=>{
      const result = await shopCollection.find().limit(20).toArray()
      res.send(result)
    })

    app.get('/allToys/:id', async(req,res)=>{
      const id = req.params.id
      const query={_id: new ObjectId(id)}
      const result=await shopCollection.findOne(query)
      res.send(result)
    })

    app.get('/getToysBySearch/:text',async(req,res)=>{
      console.log(req.params.text);
      const text=req.params.text
      const result=await shopCollection.find({
        $or:[
          {name: {$regex: text, $options:'i'}}
        ]
      }).toArray()
      res.send(result)
    })

    app.get('/getToysByCategory/:category', async(req,res)=>{
        // console.log(req.params.category);
        const result= await shopCollection.find({subcategory: req.params.category}).toArray()
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('toys server is running')
})

app.listen(port,()=>{
    console.log(`toys server is running on port: ${port}`);
})