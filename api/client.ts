// import dotenv from 'dotenv'
// import { MongoClient, ServerApiVersion } from 'mongodb';

// dotenv.config();
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// export const client = new MongoClient('mongodb+srv://sanjana:S6Zyn6JW1Mgfd83O@personal-pet-collection.hbmnsu4.mongodb.net/?retryWrites=true&w=majority&appName=personal-pet-collection', 
// {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// export async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

// export async function getDatabase() {
//   await client.connect();
//   return client.db('personal-pet-collection');
// }