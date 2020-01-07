import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("maze_requirement", table => {
        table.increments();
        table.integer("problem_id").unsigned();
        table.foreign("problem_id").references("problem.id");
        table.integer("max_blocks").unsigned().notNullable();
        table.integer("max_move").unsigned().notNullable();
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("maze_requirement");
}

