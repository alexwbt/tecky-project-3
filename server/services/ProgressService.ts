import * as Knex from "knex";
import Tables from "../tables";

export default class PService {
    constructor(private knex: Knex) { }

    async insertOrUpdateProgress(user_id: number, problem_id: number, score: number) {
        const trx = await this.knex.transaction();
        try {
            let exp = 0;

            // Get previous score
            const prevProgress = await this.getPreviousProgress(trx, user_id, problem_id);
            if (prevProgress) {
                // submitted before
                exp = await this.calculateUserGetExp(trx, problem_id, score, prevProgress.score);

                if (exp > 0) {
                    await trx(Tables.PROFILE)
                        .where("user_id", user_id)
                        .increment("experience", exp);

                    await trx.raw(`update ${Tables.PROGRESS} set score = ?, updated_at = NOW() where user_id = ? and problem_id = ?`, [score, user_id, problem_id])
                }
            } else {
                // not submitted before
                exp = await this.calculateUserGetExp(trx, problem_id, score, 0);

                await trx(Tables.PROFILE)
                    .where("user_id", user_id)
                    .increment("experience", exp);

                await trx(Tables.PROGRESS).insert({
                    user_id,
                    problem_id,
                    score,
                })
            }

            await trx.commit();
            return exp;
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    async getPreviousProgress(trx: Knex.Transaction, user_id: number, problem_id: number) {
        const progress = await trx.select("score")
            .from(Tables.PROGRESS)
            .where("user_id", user_id)
            .andWhere("problem_id", problem_id)
            .first();

        return progress;
    }

    async calculateUserGetExp(trx: Knex.Transaction, problem_id: number, score: number, prevScore: number) {
        const problem: { score: number, experience: number } = await trx.select(`${Tables.PROBLEM}.score`, `${Tables.DIFFICULTY}.experience`)
            .from(Tables.PROBLEM)
            .innerJoin(Tables.DIFFICULTY, `${Tables.PROBLEM}.difficulty_id`, `${Tables.DIFFICULTY}.id`)
            .where(`${Tables.PROBLEM}.id`, problem_id).first();

        if (score > problem.score) {
            throw Error("The score is not valid");
        }

        const exp = Math.floor(score / problem.score * problem.experience);

        if (prevScore === 0) {
            return exp;
        }

        const oldExp = Math.floor(prevScore / problem.score * problem.experience);
        return exp - oldExp > 0 ? exp - oldExp : 0;
    }
}