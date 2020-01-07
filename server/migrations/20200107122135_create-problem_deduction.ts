import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("problem_deduction", table => {
        table.integer("problem_id").unsigned();
        table.foreign("problem_id").references("problem.id");
        table.integer("type_id").unsigned();
        table.foreign("type_id").references("deduction_type.id");
        table.unique(["problem_id", "type_id"]);
        table.integer("deduct").unsigned().notNullable();
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("problem_deduction");
}

