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
    level: {
        lvl: number,
        exp: number,
        req: number
    };
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

    async getUserRoleID(id: number): Promise<number> {
        const rows = await this.knex(Tables.PROFILE).select("role_id").where("user_id", id);
        return rows[0]['role_id'];
    }

    async register(email: string, username: string, password: string, year: number) {
        const trx = await this.knex.transaction();
        try {
            const user_id = (await trx.returning("id").insert({ username, password }).into("user"))[0];
            await trx.insert({ user_id, email, year, role_id: 2 }).into("profile");
            trx.commit();
        } catch (err) {
            trx.rollback();
            throw new Error(err.message);
        }
    }

    async getProfileWithId(id: number): Promise<Profile> {
        const profile = (await this.knex(Tables.PROFILE).select().where("user_id", id))[0];
        profile.level = this.getUserLevel(profile.experience);
        return profile;
    }

    async getLocationWithId(id: number) {
        return (await this.knex(Tables.PROFILE).select("user_id", "location_id", "location.name").leftJoin("location", function () { this.on("location_id", "=", "location.id") }).where("user_id", id))[0];
    }

    getUserLevel(exp: number) {
        let lvl = 0;
        let req = 50;
        while (exp - req >= 0) {
            exp -= req;
            req *= 1.1;
            lvl++;
        }
        return { lvl, exp, req }
    }

    //SELECT (title),(difficulty.name),(problem_status.name),(problem.created_at),(problem.updated_at) FROM problem LEFT JOIN difficulty ON (difficulty_id = difficulty.id) LEFT JOIN problem_status on (problem.status_id = problem_status.id);
    // only specify user post records
    // async getPostsRecord(id: number) {  
    //     return (await this.knex.select("problem.title","difficulty.name as diffName","problem_status.name as statusName","problem.created_at","problem.updated_at")
    //     .from("problem")
    //     .leftJoin("difficulty", function(){this.on("difficulty_id", "=", "difficulty.id")})
    //     .leftJoin("problem_status", function(){this.on("problem.status_id", "=", "problem_status.id")})
    //     .where("problem.user_id", id));
    // }

    //all the user post records
    async getPostsRecord() { 
        return (await this.knex.select("problem.title","difficulty.name as diffName","problem_status.name as statusName","problem.created_at","problem.updated_at")
        .from("problem")
        .leftJoin("difficulty", "difficulty_id", "=", "difficulty.id")
        .leftJoin("problem_status", "problem.status_id", "=", "problem_status.id"));
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

}