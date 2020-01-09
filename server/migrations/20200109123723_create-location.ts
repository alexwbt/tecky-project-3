import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("location", table => {
        table.increments();
        table.string("name").unique().notNullable();
        table.string("code").unique().notNullable();
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("location");
}

