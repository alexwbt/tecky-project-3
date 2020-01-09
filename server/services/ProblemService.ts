import * as Knex from "knex";
import Tables from "../tables";
import { MongoClient } from "mongodb";

export interface IProblemStates {
    id: number;
    name: string;
}
export default class ProblemService {

    constructor(private knex: Knex, private mongoClient: MongoClient) { }

    async test() {
        await this.mongoClient.connect();
        const db = this.mongoClient.db(process.env.MONGO_DB_NAME);
        const collection = db.collection("test");
        const data = await collection.find({}).toArray();
        console.log(data);
        this.mongoClient.close();
    }

    async getStatusList() {
        const statuses = await this.knex.select("id", "name").from(Tables.PROBLEM_STATUS);
        return statuses;
    }

}


