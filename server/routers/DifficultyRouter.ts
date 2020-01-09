import { Router, Request, Response } from "express";
import { catcher } from "../main";
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
        
    }

    private get = async (req: Request, res: Response) => {

    }
}