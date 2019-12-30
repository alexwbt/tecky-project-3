import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("users");
    if (!hasTable) {
        return await knex.schema.createTable("users", table => {
            table.increments();
            table.string("username").notNullable().unique();
            table.string("password", 60).notNullable();
            table.timestamps(false, true);
        });
    }
    return Promise.resolve();
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("users");
}

