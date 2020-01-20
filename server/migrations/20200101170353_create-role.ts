import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("role", table => {
        table.increments();
        table.string("name").unique().notNullable();
    });

    await knex(Tables.ROLE).insert([
        { id: 1, name: "Admin" }, 
        { id: 2, name: "User" }, 
        { id: 3, name: "Teacher" },
    ])
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("role");
}

