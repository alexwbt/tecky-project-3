import * as Knex from "knex";
import { Db } from "mongodb";
import Tables from "../tables";
import { ProblemStatus } from "../services/ProblemService";
export interface Audit {
    id: number;
    problem_id: number;
    status: boolean;
    reason: string;
    user_id: number;
}

export default class AuditService {
    private mongodb: Db;

    constructor(private knex: Knex, mongodb: Promise<Db>) {
        mongodb.then((db: Db) => {
            this.mongodb = db;
        });
    }

    //SELECT (problem.title),(username),(difficulty.name),(category.name),(problem_status.name),(problem.created_at) FROM problem LEFT JOIN "user" ON (user_id = "user".id) LEFT JOIN difficulty ON (difficulty_id = difficulty.id) INNER JOIN category ON (category_id = category.id) INNER JOIN problem_status ON (problem.status_id = problem_status.id) WHERE (problem_status.id >= 2) AND (problem_status.id <= 3);
    async getAuditList() {
        return (await this.knex.select(
            `${Tables.PROBLEM}.id as problemID`,
            `${Tables.PROBLEM}.title`,
            `username`,
            `${Tables.DIFFICULTY}.name as diffName`,
            `${Tables.CATEGORY}.name as cateName`,
            `${Tables.PROBLEM_STATUS}.name as statusName`,
            `${Tables.PROBLEM}.created_at`)
            .from(Tables.PROBLEM)
            .leftJoin(`user`, `${Tables.PROBLEM}.user_id`, `=`, `user.id`)
            .leftJoin(`${Tables.DIFFICULTY}`, `difficulty_id`, `=`, `${Tables.DIFFICULTY}.id`)
            .leftJoin(`${Tables.CATEGORY}`, `category_id`, `=`, `${Tables.CATEGORY}.id`)
            .leftJoin(`${Tables.PROBLEM_STATUS}`, `${Tables.PROBLEM}.status_id`, `=`, `${Tables.PROBLEM_STATUS}.id`)
            .where(`${Tables.PROBLEM_STATUS}.id`, 2));
    }

    async updateAudit(
        auditor_id: number,
        problem_id: number,
        title: string,
        description: string,
        category_id: number,
        difficulty_id: number,
        status_id: number,
        score: number,
        // maxUsedBlocks,
        // maxMoveTimes,
        // deduction,
        game: any,
        reason: string
    ) {
        const trx = await this.knex.transaction();
        try {
            const problem = (await trx(Tables.PROBLEM).select("user_id").where({ id: problem_id }))[0];
            if (!problem) {
                return false;
            }
            await trx(Tables.PROBLEM).where({ id: problem_id }).update({
                title, description, category_id, difficulty_id, status_id, score
            });

            await trx.raw(`update ${Tables.AUDIT} set status = true, reason = ?, user_id = ?, updated_at = NOW() where status = false and problem_id = ?`, [reason, auditor_id, problem_id])

            await trx.commit();
            await this.mongodb.collection("game").updateOne({ pid: problem_id }, { $set: { ...game, pid: problem_id } });

            return true;
        } catch (error) {
            await trx.rollback();
            throw Error
        }
    }
}