import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex.raw(`ALTER SEQUENCE user_id_seq RESTART`);
    await knex.delete().from("user");

    const defaultUser = [
        { username: "admin", password: "$2y$12$htPDSCavDcL8sMFr3zWpie1G08dvCyhVIJijQnJEdd6TKA/vImSQi" }
    ];
    const defaultProfile = [
        { user_id: 1, email: "alexwbtg@gmail.com" }
    ];
    await knex.insert(defaultUser).into("user");
    await knex.insert(defaultProfile).into("profile");
};
