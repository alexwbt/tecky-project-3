import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("problem", table => {
        table.increments();
        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references("user.id");
        table.string("title", 70).notNullable().defaultTo("");
        table.text("description").notNullable().defaultTo("");
        table.integer("category_id").unsigned().notNullable().defaultTo(1);
        table.foreign("category_id").references("category.id");
        table.integer("difficulty_id").unsigned().notNullable().defaultTo(1);
        table.foreign("difficulty_id").references("difficulty.id");
        table.integer("status_id").unsigned().notNullable().defaultTo(1);
        table.foreign("status_id").references("problem_status.id");
        table.integer("score").unsigned().notNullable().defaultTo(0);
        // table.string("image");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("problem");
}

