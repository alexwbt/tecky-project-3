import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("difficulty", table => {
        table.increments();
        table.string("name").notNullable();
        table.integer("experience").notNullable();
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("difficulty");
}

