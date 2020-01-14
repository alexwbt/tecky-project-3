import * as Knex from "knex";


export async function up(knex: Knex): Promise<any> {
    await knex.raw(`CREATE OR REPLACE FUNCTION save_user_submission() RETURNS TRIGGER AS $submission$
	BEGIN
        --create a row when insert or update the progress
        insert into submission(user_id, problem_id, score, created_at, updated_at) 
        select NEW.user_id, NEW.problem_id, NEW.score, NEW.created_at, NEW.updated_at;
        RETURN NULL;
    END;
    $submission$ LANGUAGE plpgsql;

    CREATE TRIGGER submission
    AFTER INSERT OR UPDATE on progress
    FOR EACH ROW EXECUTE PROCEDURE save_user_submission();`)
}


export async function down(knex: Knex): Promise<any> {
    await knex.raw(`DROP TRIGGER submission ON progress;`)
    await knex.raw(`drop function save_user_submission;`)
}

