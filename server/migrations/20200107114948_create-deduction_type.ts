import * as Knex from "knex";
import Tables from "../tables";

export async function up(knex: Knex): Promise<any> {
    await knex.schema.createTable("deduction_type", table => {
        table.increments();
        table.string("title").unique().notNullable();
        table.timestamps(false, true);
    });

    await knex(Tables.DEDUCTION_TYPE).insert([
        { title: "Each blocks more the Max. Used Blocks will lose" },
        { title: "Move Times more than Max. Move will lose" },
        { title: "Each object haven't got will lose" }
    ]);
}


export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("deduction_type");
}

