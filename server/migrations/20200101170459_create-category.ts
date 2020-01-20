import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("category", table => {
        table.increments();
        table.string("name").unique().notNullable();
    });

    await knex(Tables.CATEGORY).insert([
        { id: 1, name: "Maze" }
    ]);
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("category");
}

