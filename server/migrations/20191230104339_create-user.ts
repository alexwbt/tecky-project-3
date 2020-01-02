import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("user", table => {
        table.increments();
        table.string("username").notNullable().unique();
        table.string("password", 60).notNullable();
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("user");
}
