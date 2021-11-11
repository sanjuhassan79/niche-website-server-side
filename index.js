const express = require('express')
require('dotenv').config()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const port =process.env.PORT ||5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sanju1.bssaz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });







async function run() {
  try {
    await client.connect();
      const database = client.db("Nellie");
      const NellieUserCollection = database.collection("NellieUser");
      const NellieProductCollection = database.collection("NellieProducts");
      const NellieCustomerProductCollection = database.collection("NellieCustomer");
      const NellieCustomerRatingCollection = database.collection("NellieRating");
    // Query for a movie that has the title 'The Room'


    // User add
    app.post('/users',async(req,res)=>{
     const user=req.body
      const result=await NellieUserCollection.insertOne(user)
      console.log(result);
      res.json(result)

    })


    app.put('/users',async(req,res)=>{
      const user=req.body;
      const filter={email:user.email}
      const options={upsert:true}
      const updateDoc={
          $set:user
      }
      const result=await NellieUserCollection.updateOne(filter,updateDoc,options)
      console.log(result);
      res.json(result)
})


app.put('/users/admin',async(req,res)=>{
  const user=req.body;
  const filter={email:user.email}
 
  const updateDoc={
      $set:{role:'admin'}
  }
  const result=await NellieUserCollection.updateOne(filter,updateDoc)
  console.log(result);
  res.json(result)
})







app.get('/users/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await NellieUserCollection.findOne(query);
  let isAdmin = false;
  if (user?.role === 'admin') {
      isAdmin = true;
  }
  res.json({ admin: isAdmin });
})














    // User add

// add product

app.post('/products',async(req,res)=>{

  const product=req.body;
  const result=await NellieProductCollection.insertOne(product)
  console.log(result);
  res.json(result)
  
  })


app.get('/products',async(req,res)=>{

  const cursor=NellieProductCollection.find({})
    const result=await cursor.toArray()
    res.json(result)
})
app.get('/products/:id',async(req,res)=>{

  const id=req.params.id;
  const query={_id:ObjectId(id)};
  const result=await NellieProductCollection.findOne(query)
  res.json(result)
  })




  app.delete('/products/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)}
    const result=await NellieProductCollection.deleteOne(query);
    res.json(result)
    
    })
// add product




app.get('/productsale',async(req,res)=>{

  const cursor=NellieCustomerProductCollection.find({})
    const result=await cursor.toArray()
    res.json(result)
})



app.get('/productsale/:email',async(req,res)=>{
  const id=req.params.email;
  const cursoer= NellieCustomerProductCollection.find({email:req.params.email});
  const users=await cursoer.toArray();
res.send(users)



})


app.delete('/productsale/:id',async(req,res)=>{
  const id=req.params.id;
  const query={_id:ObjectId(id)}
  const result=await NellieCustomerProductCollection.deleteOne(query);
  res.json(result)
  
  })



// addcustorm
app.post('/productsale',async(req,res)=>{

  const product=req.body;
  const result=await NellieCustomerProductCollection.insertOne(product)
  console.log(result);
  res.json(result)
  
  })



  app.put('/productsale/:id',async(req,res)=>{
    const id=req.params.id;
    const updarestatus=req.body;
    const filter={_id:ObjectId(id)};
    const options={upsert:true}
    const updateDoc={
      $set: {
        status:updarestatus.status
      },
    }
    const result=await NellieCustomerProductCollection.updateOne(filter,updateDoc,options)
    console.log(result);
    res.json(result)
})
// addcustorm
    





// Rating our products
app.get('/rating',async(req,res)=>{

  const cursor=NellieCustomerRatingCollection.find({})
    const result=await cursor.toArray()
    res.json(result)
})




app.post('/rating',async(req,res)=>{

  const product=req.body;
  const result=await NellieCustomerRatingCollection.insertOne(product)
  console.log(result);
  res.json(result)
  
  })

// Rating our products






  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
























app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
