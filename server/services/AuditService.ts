import * as Knex from "knex";
import Tables from "../tables";


export default class AuditService {

    constructor(private knex: Knex) { }

    //SELECT (problem.title),(username),(difficulty.name),(category.name),(problem_status.name),(problem.created_at) FROM problem LEFT JOIN "user" ON (user_id = "user".id) LEFT JOIN difficulty ON (difficulty_id = difficulty.id) INNER JOIN category ON (category_id = category.id) INNER JOIN problem_status ON (problem.status_id = problem_status.id) WHERE (problem_status.id >= 2) AND (problem_status.id <= 3);
    async getAuditList() {
        return (await this.knex.select(
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
            .where(`${Tables.PROBLEM_STATUS}.id`, 2).orWhere(`${Tables.PROBLEM_STATUS}.id`, 3));
    }

}