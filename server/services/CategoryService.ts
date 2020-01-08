import * as Knex from "knex";
import Tables from "../tables";

export interface Category {
    id: number;
    name: string;
}

export default class CategoryService {
    constructor(private knex: Knex) {}

    async getCategory() {
        const categories: Category[] = await this.knex.select().from(Tables.CATEGORY);        
        return categories;
    }
}