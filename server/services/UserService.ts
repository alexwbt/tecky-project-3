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
    experience: number
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
            await trx.insert({user_id, email}).into("profile");
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

}


