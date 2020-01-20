import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("problem_status", table => {
        table.increments();
        table.string("name").unique().notNullable();
    });

    await knex(Tables.PROBLEM_STATUS).insert([
        { id: 1, name: "Work In Progress" },
        { id: 2, name: "Ready to audit" },
        { id: 3, name: "Rejected" },
        { id: 4, name: "Published" }
      ])
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("problem_status");
}

