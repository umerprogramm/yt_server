const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const port = 5000
const stripe = require('stripe')(env.process.STRIPE_KEY);
const fs = require('fs')
const { MongoClient } = require('mongodb')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())




uri = env.process.URI
app.get('/getData', async (req,res)=>{
  const client = new MongoClient(uri);
try {
 let  conn = await client.connect();
let database =  conn.db("youtube")
let col  = await database.collection("videos_info")
let result = await col.find({}).toArray()

res.send(result)

} catch(e) {
  console.error(e);
}
})


app.post('/charge', async (req, res) => {
  const { amount, source, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: 'pm_card_visa',
    });

    // Handle success, update your database, etc.
    res.status(200).send({ success: true, paymentIntent });
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.post('/check_user_or_get_user',async (req,res)=>{
  const client = new MongoClient(uri);
  let  conn = await client.connect();

  const { full_name , avator , email  } = req.body
console.log(req.body)
let database =  conn.db("youtube")
let col  = await database.collection("user")
let result = await col.findOne({
  email
})

if(result){
    res.send(result)
}else {
    let inserted = col.insertOne({
      full_name,
      avator,
      email,
      perineum : []
    })

    res.send(inserted)
}



})




app.get('/', (req, res) => {
const query = req.query.v
const videoStream = fs.createReadStream(`${query}.mp4`)
res.writeHead(200,{'Content-Type' : 'video/mp4'})
videoStream.pipe(res)
console.log(query)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})



