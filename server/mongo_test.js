const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  console.log("Connected to MongoDB!!");

  // Database will be created if db name doesn't already exist
  const dbName = "tiered-bad-bank";
  const db = client.db(dbName);

  // Create a new user
  const name = "user" + Math.floor(Math.random() * 10000);
  const email = name + "@mit.edu";

  // Insert a DOCUMENT into this data store (ie Mongo):
  // Insert new user into Customer COLLECTION
  // * Collection is like a NoSQL Table *
  let collection = db.collection("customers");
  let doc = { name, email };
  collection.insertOne(doc, { w: 1 }, (err, result) => {
    console.log("Document inserted!");
  });

  // Read from MongoDB Customer Collection
  (async () => {
    const results = await collection.find({}).toArray();
    console.log(results);

    // Clean up DB
    client.close();
  })();
});
