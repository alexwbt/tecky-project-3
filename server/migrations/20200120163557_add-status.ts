import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
  await knex(Tables.PROBLEM_STATUS).insert([
    { id: 5, name: "Deleted" }
  ])
}

export async function down(knex: Knex): Promise<any> {
  await knex(Tables.PROBLEM_STATUS).where({ id: 5 }).del();
}

