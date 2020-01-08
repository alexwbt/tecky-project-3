import { Router, Request, Response } from "express";
import { catcher } from "../main";

import CategoryService from "../services/CategoryService";

export default class CategoryRouter {
    constructor(private categoryService: CategoryService) {}

    router() {
        const router = Router();
        router.get("/types/", catcher(this.getTypes));
        return router;
    }

    private getTypes = async (req: Request, res: Response) => {
        const categories = await this.categoryService.getCategory();
        res.json({ categories });
    }
}