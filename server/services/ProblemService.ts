import * as Knex from "knex";
import Tables from "../tables";
import { MongoClient } from "mongodb";

import { ICategory } from './CategoryService'
import { IDifficulty } from './DifficultyService'

export interface IProblem {
    title: string;
    category: ICategory | null;
    difficulty: IDifficulty | null;
    status: IProblemStatus | null;
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

    async getStatusList() {
        const statuses: IProblemStatus[] = await this.knex.select("id", "name").from(Tables.PROBLEM_STATUS);
        return statuses;
    }

    async create(
        problemInfo: {
            title: string,
            categoryID: number,
            difficultyID: number,
            description: string,
            score: number,
            deduction: {
                id: number,
                score: number,
            }[],
        }
        , game: any
    ) {
        console.log(problemInfo);
        console.log(game);

        // insert the problem info part
        
        

        // insert the game part
        await this.mongoClient.connect();
        const db = this.mongoClient.db(process.env.MONGO_DB_NAME);
        const gameCollection = db.collection("game");
        await gameCollection.insertOne({...game, pid: 1});

        return { id: 1 }
    }

}


