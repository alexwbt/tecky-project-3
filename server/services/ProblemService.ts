import * as Knex from "knex";
import Tables from "../tables";
import { Db } from "mongodb";
import { Audit } from "./AuditService";

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

export enum ProblemStatus {
    WorkInProgress = 1,
    ReadyToAudit = 2,
    Rejected = 3,
    Published = 4,
}

export default class ProblemService {

    private mongodb: Db;

    constructor(private knex: Knex, mongodb: Promise<Db>) {
        mongodb.then((db: Db) => {
            this.mongodb = db;
        });
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
        const trx = await this.knex.transaction();

        try {
            const problem = (await trx(Tables.PROBLEM).select("user_id", "status_id").where({ id }))[0];
            if (!problem || problem.user_id !== user_id) {
                return {
                    success: false,
                    message: "You are not the creator of this challenge."
                };
            }
            if (problem.status_id === ProblemStatus.ReadyToAudit || problem.status_id === ProblemStatus.Published) {
                // Ready to audit or Published
                return {
                    success: false,
                    message: "This challenge is auditing or published. You are not allowed to edit."
                };
            }
            
            await trx(Tables.PROBLEM).where({ user_id, id }).update({
                title, description, category_id, difficulty_id, status_id, score
            });

            if (status_id === ProblemStatus.ReadyToAudit) {
                await trx(Tables.AUDIT).insert({
                    problem_id: id,
                    status: false,
                    reason: "",
                    user_id: 1,
                })
            }

            await trx.commit();
            await this.mongodb.collection("game").updateOne({ pid: id }, { $set: { ...game, pid: id } });

            return {
                success: true,
                message: "Successfully Saved"
            };
        } catch (error) {
            await trx.rollback();
            throw Error
        }

    }

    async getProblemInfo(id: number) {
        const problem = (await this.knex.select().from(Tables.PROBLEM).where("id", id))[0]
        if (problem.status_id === ProblemStatus.Rejected) {
            const audit = await this.knex.select("reason").from(Tables.AUDIT).where("problem_id", id).orderBy("id", "desc").first();
            problem.reason = audit.reason;
        }
        return problem;
    }

    async getProblemContent(id: number) {
        return await this.mongodb.collection("game").findOne({ pid: id });
    }

    async getProblemLatestAuditInfo(id: number) {
        const audit: Audit = (await this.knex.select().from(Tables.AUDIT).where("problem_id", id).orderBy("id", "desc"))[0]
        return audit;
    }

    async getProblemList() {
        const problems = await this.knex(Tables.PROBLEM).select([`id`, "title", "difficulty_id", "created_at", "updated_at", "user_id"])
            .orderBy("created_at")
        // .where({ status_id : 4 });
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


