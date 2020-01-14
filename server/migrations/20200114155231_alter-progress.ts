import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.alterTable(Tables.PROGRESS, table => {
        table.dropColumn("submitted");
    })
}


export async function down(knex: Knex): Promise<any> {
    await knex.schema.alterTable(Tables.PROGRESS, table => {
        table.boolean("submitted");
    })

    await knex(Tables.PROGRESS).update({ submitted: true });

    await knex.schema.alterTable(Tables.PROGRESS, table => {
        table.boolean("submitted").notNullable().alter();
    })
}