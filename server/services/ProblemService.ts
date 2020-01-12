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
        const pid = (await this.knex("problem").insert({ user_id }, ["id"]))[0].id;
        await this.mongodb.collection("game").insertOne({ pid });
        return pid;
    }

    async editProblem(
        user_id: number,
        id: number,
        title: string,
        description: string,
        category_id: number,
        difficulty_id: number,
        status_id: number,
        score: number,
        // maxUsedBlocks,
        // maxMoveTimes,
        // deduction,
        game: any
    ) {
        await this.knex("problem").where({ user_id, id }).update({
            title, description, category_id, difficulty_id, status_id, score
        });
        await this.mongodb.collection("game").updateOne({ pid: id }, { $set: { ...game, pid: id } });
    }

    async getProblemInfo(id: number) {
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


