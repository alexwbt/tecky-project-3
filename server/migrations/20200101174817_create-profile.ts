import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("profile", table => {
        table.integer("user_id").unsigned().unique();
        table.foreign("user_id").references("user.id");
        table.string("email").unique().notNullable();
        table.string("image");
        table.integer("experience").notNullable();
        table.timestamps(false, true);
    });
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("profile");
}
