import * as Knex from "knex";
import Tables from "../tables";

export async function seed(knex: Knex): Promise<any> {
    await knex.raw(`ALTER SEQUENCE user_id_seq RESTART`);
    await knex.delete().from(Tables.PROFILE);
    await knex.delete().from(Tables.USER);

    const defaultUser = [
        {
            username: "admin",
            password: "$2y$12$htPDSCavDcL8sMFr3zWpie1G08dvCyhVIJijQnJEdd6TKA/vImSQi",
            email: "admin@blockDojo.com",
            role_id: 1,
        },
        {
            username: "user",
            password: "$2y$12$RVnm82Eh5YxU6Za36696du7N9qBEvT.s.iSsAEWvZDN/jjTrz1K5u",
            email: "user@blockDojo.com",
            role_id: 2,
            location_id: 100,
        }
    ];

    await knex.insert(defaultUser.map(user => ({
        username: user.username,
        password: user.password
    }))).into(Tables.USER);
    await knex.insert(defaultUser.map((user, i) => ({
        user_id: i + 1,
        email: user.email,
        year: 1990,
        role_id: user.role_id,
        location_id: user.location_id ? user.location_id : null,
    }))).into(Tables.PROFILE);
};
