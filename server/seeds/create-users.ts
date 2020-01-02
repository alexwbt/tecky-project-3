import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex.raw(`ALTER SEQUENCE user_id_seq RESTART`);
    await knex.raw(`DELETE FROM "user"`);

    await knex.raw(`INSERT INTO "user" (username, password) VALUES (?, ?)`,
        ["admin", "$2y$12$htPDSCavDcL8sMFr3zWpie1G08dvCyhVIJijQnJEdd6TKA/vImSQi"]);
};
