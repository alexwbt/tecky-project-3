import * as Knex from "knex";
import Tables from "../tables";

type User = {
    id: number;
    username: string;
    password: string;
};

type Profile = {
    user_id: number,
    email: string,
    image?: string,
    experience: number,
    location: string,
    role_id: number;
};

export default class UserService {

    constructor(private knex: Knex) { }

    async getUserWithUsername(username: string): Promise<User> {
        return (await this.knex(Tables.USER).select().where("username", username))[0];
    }

    async getUserIdWithEmail(email: string): Promise<number> {
        return (await this.knex(Tables.PROFILE).select("user_id").where("email", email))[0];
    }

    async getUsernameWithId(id: number) {
        return (await this.knex(Tables.USER).select("username").where({ id }))[0];
    }

    async register(email: string, username: string, password: string) {
        const trx = await this.knex.transaction();
        try {
            const user_id = (await trx.returning("id").insert({ username, password }).into("user"))[0];
            await trx.insert({ user_id, email }).into("profile");
            trx.commit();
        } catch (err) {
            trx.rollback();
            throw new Error("Failed To Register");
        }
    }

    async getProfileWithId(id: number): Promise<Profile> {
        return (await this.knex(Tables.PROFILE).select().where("user_id", id))[0];
    }

    async getLocationWithId(id: number) {
        return (await this.knex(Tables.PROFILE).select("user_id", "location_id", "location.name").leftJoin("location", function () { this.on("location_id", "=", "location.id") }).where("user_id", id))[0];
    }

    //SELECT (problem.user_id),(title),(name),(status),(audit.created_at),(audit.updated_at) FROM audit LEFT JOIN problem ON (problem_id = problem.id) LEFT JOIN difficulty ON (difficulty_id = difficulty.id) WHERE (problem.user_id = `inputId`);
    async getPostsRecord(id: number) {
        return (await this.knex.select("problem.user_id", "title", "name", "status", "audit.created_at", "audit.updated_at")
            .from("audit")
            .leftJoin("problem", function () { this.on("problem_id", "=", "problem.id") })
            .leftJoin("difficulty", function () { this.on("difficulty_id", "=", "difficulty.id") })
            .where("problem.user_id", id));
    }


    //SELECT (progress.user_id),(title),(name),(progress.score),(progress.created_at) FROM progress LEFT JOIN problem ON (problem_id = problem.id) LEFT JOIN difficulty ON (difficulty_id = difficulty.id) WHERE (progress.user_id = `inputId`);
    async getSolvedRecord(id: number) {
        return (await this.knex.select("progress.user_id", "title", "name", "progress.score", "progress.created_at")
            .from("progress")
            .leftJoin("problem", function () { this.on("problem_id", "=", "problem.id") })
            .leftJoin("difficulty", function () { this.on("difficulty_id", "=", "difficulty.id") })
            .where("progress.user_id", id));
    }

    //SELECT (user_id),(username),(experience),(location.name) FROM "user" INNER JOIN profile ON (profile.user_id = "user".id) LEFT JOIN location ON (location_id = location.id) WHERE (profile.role_id = 2) ORDER BY experience DESC LIMIT 5;
    async getRankingList() {
        return (await this.knex.select("user_id", "username", "experience", "location.name")
            .from("user")
            .innerJoin("profile", "profile.user_id", "=", "user.id")
            .leftJoin("location", function () { this.on("location_id", "=", "location.id") })
            .where("profile.role_id", 2) // where role = user only
            .orderBy("experience", "DESC").limit(5));
    }

    //SELECT (problem.title),(username),(difficulty.name),(category.name),(problem_status.name),(problem.created_at) FROM problem LEFT JOIN "user" ON (user_id = "user".id) LEFT JOIN difficulty ON (difficulty_id = difficulty.id) INNER JOIN category ON (category_id = category.id) INNER JOIN problem_status ON (problem.status_id = problem_status.id) WHERE (problem_status.id >= 2) AND (problem_status.id <= 3);
    async getAuditList() {
        return (await this.knex.select("problem.title","username","difficulty.name as diffName","category.name as cateName","problem_status.name as statusName","problem.created_at")
        .from("problem")
        .leftJoin("user","problem.user_id","=","user.id")
        .leftJoin("difficulty", "difficulty_id","=","difficulty.id")
        .leftJoin("category","category_id","=","category.id")
        .leftJoin ("problem_status", "problem.status_id","=","problem_status.id")
        .where ("problem_status.id", 2));
    }
}