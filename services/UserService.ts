import * as Knex from "knex";
import { User } from "../types";
import { hashPassword } from "../hash";


export class UserService {

    constructor(private knex: Knex) { }

    async getUserWithUsername(username: string): Promise<User> {
        return (await this.knex.raw(`SELECT * FROM users WHERE username = ?`, [username])).rows[0];
    }

    async register(email: string, username: string, password: string): Promise<boolean> {
        const duplicate = (await this.knex.raw(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username])).rowCount;
        if (duplicate > 0) {
            return false;
        }
        await this.knex.raw(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, [email, username, await hashPassword(password)]);
        return true;
    }

}
