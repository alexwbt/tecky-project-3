import * as Knex from "knex";
import Tables from "../tables";

export interface IDifficulty {
    id: number;
    name: string;
    experience: number;
}

export default class DifficultyService {
    constructor(private knex: Knex) {}

    async getDifficulties() {
        const difficulties: IDifficulty[] = await this.knex.select().from(Tables.DIFFICULTY);        
        return difficulties;
    }
}