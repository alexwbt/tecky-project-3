import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
  await knex.raw(`TRUNCATE TABLE role RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE category RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE problem_status RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE difficulty RESTART IDENTITY CASCADE`);
  await knex.raw(`TRUNCATE TABLE deduction_type RESTART IDENTITY CASCADE`);

  // user role
  await knex("role").insert([
    { name: "admin" }, { name: "user" }, { name: "teacher" },
  ])

  // problem category
  await knex("category").insert([
    { name: "maze" }
  ]);

  // problem status
  await knex("problem_status").insert([
    { name: "Work In Progress" },
    { name: "Ready to audit" },
    { name: "Rejected" },
    { name: "Published" }
  ])

  // problem difficulty
  await knex("difficulty").insert([
    { name: "Easy", experience: 10 },
    { name: "Medium", experience: 50 },
    { name: "Hard", experience: 100 },
    { name: "Very Hard", experience: 500 }
  ]);

  // problem deduction type
  await knex("deduction_type").insert([
    { title: "Each blocks more than maximum lose" },
    { title: "Move Times more than maximum lose" },
    { title: "Each coin haven't got lose" }
  ]);
}