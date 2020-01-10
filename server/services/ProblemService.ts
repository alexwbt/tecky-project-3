import * as Knex from "knex";
import Tables from "../tables";
import { MongoClient } from "mongodb";


export interface IProblem {
    title: string;
    categoryID: number;
    difficultyID: number;
    statusID: number;
}

export interface IProblemInfo extends IProblem {
    description: string;
    score: number;
    deduction: IProblemDeduction[] | null;
}
export interface IProblemStatus {
    id: number;
    name: string;
}

export interface IProblemDeduction {
    id: number;
    title: string;
    deduct: number;
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

    async createProblem(
        title: string,
        description: string,
        score: number,
        category_id: number,
        difficulty_id: number,
        status_id: number,
        game: any
    ) {
        // insert problem info
        const problem = (await this.knex("problem").insert({
            title,
            description,
            score,
            category_id,
            difficulty_id,
            status_id
        }, ["id"]))[0];

        // insert game content
        await this.mongoClient.connect();
        const db = this.mongoClient.db(process.env.MONGO_DB_NAME);
        const gameCollection = db.collection("game");
        await gameCollection.insertOne({ ...game, pid: problem.id });

        return problem.id;
    }

    async getProblem(id: number) {
        return (await this.knex.select().from("problem").where("id", id))[0];
    }

    // Get Static Table
    async getStatusList() {
        const statuses: IProblemStatus[] = await this.knex.select("id", "name").from(Tables.PROBLEM_STATUS);
        return statuses;
    }

}


