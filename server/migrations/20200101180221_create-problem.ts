import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("problem", table => {
        table.increments();
        table.string("title", 70).notNullable();
        table.text("description").notNullable();
        table.integer("category_id").unsigned().notNullable();
        table.foreign("category_id").references("category.id");
        table.string("image");
        table.integer("score").unsigned().notNullable();
        table.integer("difficulty_id").unsigned().notNullable();
        table.foreign("difficulty_id").references("difficulty.id");
        table.integer("status_id").unsigned().notNullable();
        table.foreign("status_id").references("problem_status.id");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("problem");
}

