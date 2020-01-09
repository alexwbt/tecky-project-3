import { Router, Request, Response } from "express";
import { catcher } from "../main";

import CategoryService from "../services/CategoryService";

export default class CategoryRouter {
    constructor(private categoryService: CategoryService) {}

    router() {
        const router = Router();
        router.get("/", catcher(this.getAll));
        return router;
    }

    private getAll = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getCategories();
        res.json({ categories });
    }
}