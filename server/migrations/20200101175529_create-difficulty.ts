import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("difficulty", table => {
        table.increments();
        table.string("name").unique().notNullable();
        table.integer("experience").unsigned().notNullable();
    });

    await knex(Tables.DIFFICULTY).insert([
        { id: 1, name: "Easy", experience: 10 },
        { id: 2, name: "Medium", experience: 50 },
        { id: 3, name: "Hard", experience: 100 },
        { id: 4, name: "Very Hard", experience: 500 }
    ]);
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("difficulty");
}

