import * as Knex from "knex";
import Tables from "../tables";
import { MongoClient, Db } from "mongodb";


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

    private mongodb: Db;

    constructor(private knex: Knex, mongodb: Promise<Db>) {
        mongodb.then((db: Db) => {
            this.mongodb = db;
        });
    }

    async test() {
        const data = await this.mongodb.collection("test").find({}).toArray();
        console.log(data);
    }

    async createProblem(user_id: number) {
        return 0;
    }

    async editProblem(
        problemID: number,
        title: string,
        description: string,
        score: number,
        category_id: number,
        difficulty_id: number,
        status_id: number,
        // maxUsedBlocks,
        // maxMoveTimes,
        // deduction,
        game: any
    ) {
        // TODO Alter tables instead of inserting

        // insert problem info
        // const problem = (await this.knex("problem").insert({
        //     title,
        //     description,
        //     score,
        //     category_id,
        //     difficulty_id,
        //     status_id
        // }, ["id"]))[0];

        // insert game content
        // const gameCollection = this.mongodb.collection("game");
        // await gameCollection.insertOne({ ...game, pid: problem.id });
    }

    async getProblemInfo(id: number): Promise<IProblemInfo> {
        return (await this.knex.select().from("problem").where("id", id))[0];
    }

    async getProblemContent(id: number) {
        return await this.mongodb.collection("game").findOne({ pid: id });
    }

    // Get Static Table
    async getStatusList() {
        const statuses: IProblemStatus[] = await this.knex.select("id", "name").from(Tables.PROBLEM_STATUS);
        return statuses;
    }

}


