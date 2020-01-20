import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
    await knex(Tables.PROBLEM_STATUS).insert([
        { name: "Deleted" }
      ])
}

export async function down(knex: Knex): Promise<any> {
}

