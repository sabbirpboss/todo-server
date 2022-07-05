const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const ObjectId = require("mongodb").ObjectId;

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

    // GET todo: Read/display/load *all todos in the browser
    app.get("/todos", async (req, res) => {
      const todos = await todoCollection.find({}).toArray();
      res.send(todos);
    });

    // POST todo: Add/create a new todo
    app.post("/todos", async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });

    // DELETE todo: Delete a todo
    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const result = await todoCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    // UPDATE todo: find a single todo by id for updating and then use PUT to update the todo
    app.get("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const todo = await todoCollection.findOne({ _id: ObjectId(id) });
      res.send(todo);
    });

    app.put("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const todo = req.body;
      const filter = { _id: ObjectId(id) }; // filter is a query object, we can use as well as query
      const options = { upsert: true }; // upsert is a boolean, if true, it will create a new todo if it doesn't exist it will update the todo
      const updateDoc = {
        $set: todo,
      };
      const result = await todoCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } catch (err) {
    console.log(err);
  }
};
run().catch(console.dir); // Run the run function

app.get("/", (req, res) => {
  res.send("ToDo app running successfully.");
});

app.listen(port, () => {
  console.log(`ToDo app listening on port ${port}`);
});
