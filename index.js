const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ywkglu3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const therapyCollection = client.db("physiotherapy").collection("services");
    //review collection
    const reviewCollection = client.db("physiotherapy").collection("reviews");

    //3 services api
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = therapyCollection.find(query);
      const service = await cursor.limit(3).toArray();
      res.send(service);
    });
    //all services api
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = therapyCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //single service api
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await therapyCollection.findOne(query);
      res.send(service);
    });

    //get reviews api with name
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.reviewName) {
        query = {
          reviewName: req.query.reviewName,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // get reviews api with email
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // update review api
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewCollection.findOne(query);
      res.send(review);
    });

    // create patch api
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = req.body;
      const updatedReviewed = {
        $set: {
          textarea: review.textarea,
        },
      };
      const result = await reviewCollection.updateOne(query, updatedReviewed);
      res.send(result);
    });

    //create reviews post api
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // create service post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await therapyCollection.insertOne(service);
      res.send(result);
    });

    // delete api
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("Physiotherapy server is running");
});

app.listen(port, () => {
  console.log(`Physiotherapy server is on: ${port}`);
});
