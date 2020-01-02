import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("problem", table => {
        table.increments();
        table.string("title", 70).notNullable();
        table.text("description").notNullable();
        table.string("image");
        table.boolean("published").notNullable();
        table.integer("difficulty_id").unsigned();
        table.foreign("difficulty_id").references("difficulty.id");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("problem");
}

