import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.schema.alterTable('profile', table => {
        table.integer("location_id");
        table.foreign("location_id").references("location.id");
    })
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.alterTable('profile', table => {
        table.dropForeign(["location_id"]);
        table.dropColumn("location_id");
    })
}
