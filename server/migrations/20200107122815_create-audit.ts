import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("audit", table => {
        table.increments();
        table.integer("problem_id").unsigned();
        table.foreign("problem_id").references("problem.id");
        table.boolean("status").notNullable();
        table.text("reason").notNullable();
        table.integer("user_id").unsigned().notNullable();
        table.foreign("user_id").references("user.id");
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("audit");
}

