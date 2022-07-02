const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.knago.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const todoCollection = client.db("todo").collection("todos");

    app.get("/todos", async (req, res) => {
      const todos = await todoCollection.find({}).toArray();
      res.send(todos);
    }
    );

    app.post("/todos", async (req, res) => {
        const todo = req.body;
        await todoCollection.insertOne(todo);
        res.send(todo);
        }
    );

  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ToDo app running successfully.");
});

app.listen(port, () => {
  console.log(`ToDo app listening on port ${port}`);
});
