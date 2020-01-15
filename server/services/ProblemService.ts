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
        const pid = (await this.knex(Tables.PROBLEM).insert({ user_id }, ["id"]))[0].id;
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
        const problem = (await this.knex(Tables.PROBLEM).select("user_id").where({ id }))[0];
        if (!problem || problem.user_id !== user_id) {
            return;
        }
        await this.knex(Tables.PROBLEM).where({ user_id, id }).update({
            title, description, category_id, difficulty_id, status_id, score
        });
        await this.mongodb.collection("game").updateOne({ pid: id }, { $set: { ...game, pid: id } });
    }

    async getProblemInfo(id: number) {
        return (await this.knex.select().from(Tables.PROBLEM).where("id", id))[0];
    }

    async getProblemContent(id: number) {
        return await this.mongodb.collection("game").findOne({ pid: id });
    }

    async getProblemList() {
        const problems = await this.knex.select(["id", "title", "difficulty_id"]).from(Tables.PROBLEM).where({ status_id: 4 });
        for (let i = 0; i < problems.length; i++) {
            problems[i].rating = await this.getProblemRating(problems[i].id);
        }
        return problems;
    }

    async rateProblem(user_id: number, problem_id: number, rating: number) {
        const rated = !!await this.getProblemRatingOfUser(user_id, problem_id);
        if (rated) {
            await this.knex(Tables.RATING).where({ user_id, problem_id }).update({ rating });
        } else {
            await this.knex(Tables.RATING).insert({ user_id, problem_id, rating });
        }
    }

    async getProblemRating(problem_id: number) {
        const ratings = await this.knex(Tables.RATING).select("rating").where({ problem_id });
        let rating = 0;
        for (let i = 0; i < ratings.length; i++) {
            rating += ratings[i].rating;
        }
        return { rating, rated: ratings.length };
    }

    async getProblemRatingOfUser(user_id: number, problem_id: number) {
        return (await this.knex(Tables.RATING).select("rating").where({ user_id, problem_id }))[0];
    }

    // Get Static Table
    async getStatusList() {
        const statuses: IProblemStatus[] = await this.knex.select("id", "name").from(Tables.PROBLEM_STATUS);
        return statuses;
    }

}


