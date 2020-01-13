import * as Knex from "knex";


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
};

export default class UserService {

    constructor(private knex: Knex) { }

    async getUserWithUsername(username: string): Promise<User> {
        return (await this.knex.select().from("user").where("username", username))[0];
    }

    async getUserIdWithEmail(email: string): Promise<number> {
        return (await this.knex.select("user_id").from("profile").where("email", email))[0];
    }

    async register(email: string, username: string, password: string) {
        const trx = await this.knex.transaction();
        try {
            const user_id = (await trx.returning("id").insert({ username, password }).into("user"))[0];
            await trx.insert({ user_id, email }).into("profile");
            trx.commit();
        } catch (err) {
            trx.rollback();
            console.log(err.message);
            throw new Error("Failed To Register");
        }
    }

    async getProfileWithId(id: number): Promise<Profile> {
        return (await this.knex.select().from("profile").where("user_id", id))[0];
    }

    async getLocationWithId(id: number) {
        return (await this.knex.select("user_id", "location_id", "location.name").from("profile").leftJoin("location", function () { this.on("location_id", "=", "location.id") }).where("user_id", id))[0];
    }

    //SELECT (user_id),(title),(name),(status),(audit.created_at),(audit.updated_at) FROM audit INNER JOIN problem ON (problem_id = problem.id) INNER JOIN difficulty ON (difficulty_id = difficulty.id);
    async getPostsRecord(id:number) {
        return (await this.knex.select("user_id", "title", "name", "status", "audit.created_at","audit.updated_at")
        .from("audit")
        .leftJoin("problem", function(){this.on("problem_id", "=", "problem.id")})
        .leftJoin("difficulty", function(){this.on("difficulty_id","=","difficulty.id")})
        .where("audit.user_id", id));
    }


    //SELECT (user_id),(title),(name),(progress.score),(progress.created_at) FROM progress INNER JOIN problem ON (problem_id = problem.id) INNER JOIN difficulty ON (difficulty_id = difficulty.id);
    async getSolvedRecord(id:number) {
        return (await this.knex.select("user_id", "title", "name", "progress.score", "progress.created_at")
        .from("progress")
        .leftJoin("problem", function(){this.on("problem_id", "=", "problem.id")})
        .leftJoin("difficulty", function(){this.on("difficulty_id","=","difficulty.id")})
        .where("progress.user_id", id));
    }

    //SELECT (user_id),(username),(experience),(location.name) FROM "user" FULL JOIN profile ON (user_id = "user".id) LEFT JOIN location ON (location_id = location.id) ORDER BY (experience) DESC LIMIT 5;
    async getRankingList () {
        return (await this.knex.select("user_id", "username", "experience", "location.name")
        .from("user").fullOuterJoin("profile", function(){this.on("user_id","=","user.id")})
        .leftJoin("location", function(){this.on("location_id", "=", "location.id")})
        .orderBy("experience", "DESC").limit(5));
    }
}