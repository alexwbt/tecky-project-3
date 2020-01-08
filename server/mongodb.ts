import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGO_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

export { mongoClient }