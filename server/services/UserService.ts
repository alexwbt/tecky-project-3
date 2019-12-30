import * as Knex from "knex";


type User = {
    id: number;
    username: string;
    password: string;
};

export default class UserService {

    constructor(private knex: Knex) { }

    async getUserWithUsername(username: string): Promise<User> {
        return (await this.knex.raw(`SELECT * FROM users WHERE username = ?`, username)).rows[0];
    }

}


