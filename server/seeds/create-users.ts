import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex.raw(`ALTER SEQUENCE user_id_seq RESTART`);
    await knex.delete().from("profile");
    await knex.delete().from("user");

    const defaultUser = [
        { username: "admin", password: "$2y$12$htPDSCavDcL8sMFr3zWpie1G08dvCyhVIJijQnJEdd6TKA/vImSQi", email: "alexwbtg@gmail.com" }
    ];
    
    await knex.insert(defaultUser.map(user => ({
        username: user.username,
        password: user.password
    }))).into("user");
    await knex.insert(defaultUser.map((user, i) => ({
        user_id: i + 1,
        email: user.email
    }))).into("profile");
};
