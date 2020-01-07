import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("category", table => {
        table.increments();
        table.string("name").unique().notNullable();
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("category");
}

