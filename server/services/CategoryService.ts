import * as Knex from "knex";
import Tables from "../tables";

export interface ICategory {
    id: number;
    name: string;
}

export default class CategoryService {
    constructor(private knex: Knex) {}

    async getCategories() {
        const categories: ICategory[] = await this.knex.select().from(Tables.CATEGORY);        
        return categories;
    }
}