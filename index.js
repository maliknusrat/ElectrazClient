const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const prot = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//ashanmahmudashik
//zWA2sBYCESJAmtnX

app.get("/", (req, res) => {
  res.send("Simple CURD is running");
});

const uri =
  "mongodb+srv://electronic:Iq1AtK3CfRkROrXQ@cluster0.nugqait.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("ElectraZ");
    const productsCollection = database.collection("products");
    
    const cartsCollection = client.db("ElectraZ").collection("carts");

    //read
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
      
    app.get("/addToCart/:email", async (req, res) => {
      const email = req.params.email;
      const cursor = cartsCollection.find();
      const allCart = await cursor.toArray();
      const result = allCart.filter(cart => cart.email == email);
      res.send(result);
    });
    
    app.get("/product/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);
        console.log(id,query,result);
        res.send(result);
    });

    //create
    app.post("/products", async (req, res) => {
      const productInfo = req.body;
      const result = await productsCollection.insertOne(productInfo);
      res.send(result);
    });
      
    app.post("/addToCart", async (req, res) => {
      const cartInfo = req.body;
      const result = await cartsCollection.insertOne(cartInfo);
      res.send(result);
    });

    //delete
    app.delete("/delete-product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    //update

    app.put("/update-product/:id", async (req, res) => {
      const id = req.params.id;
      const productInfo = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          productName: productInfo.productName,
          price: productInfo.price,
          category: productInfo.category,
          Rating: productInfo.Rating,
          brandName: productInfo.brandName,
          details: productInfo.details,
        },
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(prot, () => {
  console.log(`CURD is running on ${prot}`);
});
