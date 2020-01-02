import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("rating", table => {
        table.integer("user_id").unsigned();
        table.foreign("user_id").references("user.id");
        table.integer("problem_id").unsigned();
        table.foreign("problem_id").references("problem.id");
        table.unique(["user_id", "problem_id"]);
        table.integer("rating").unsigned().notNullable();
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("rating");
}
