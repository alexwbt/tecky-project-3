import { Router, Request, Response } from "express";
import { catcher } from "../middleware";
import DifficultyService from "../services/DifficultyService";


export default class DifficultyRouter {
    constructor(private difficultyService: DifficultyService) { }

    router() {
        const router = Router();
        router.get("/", catcher(this.getAll));
        router.get("/:id", catcher(this.get));
        return router;
    }

    private getAll = async (req: Request, res: Response) => {
        const difficulties = await this.difficultyService.getDifficulties();
        res.json({ difficulties })
    }

    private get = async (req: Request, res: Response) => {

    }
}