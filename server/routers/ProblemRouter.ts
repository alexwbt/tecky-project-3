import { Router, Request, Response } from "express";
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProblemService, { IProblemInfo } from "../services/ProblemService";

export default class ProblemRouter {

    constructor(private problemService: ProblemService) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.uploadProblem));
        router.get("/statuses/", catcher(this.getProblemStatuses));
        router.get("/test/", catcher(this.test));
        return router;
    }

    private uploadProblem = async (req: Request, res: Response) => {

        const problem = req.body.problem;

        console.log(problem);
        
        
        const problemInfo = {
            title: problem.title,
            categoryID: problem.categoryID,
            difficultyID: problem.difficultyID,
            description: problem.description,
            score: problem.score,
            deduction: problem.deduction,
        }

        const game = {
            canvas: problem.canvas,
            code: problem.code,
            avalibleBlocks: problem.avalibleBlocks,
            avalibleCategories: problem.avalibleCategories,
            useCategory: problem.useCategory,
            useVariables: problem.useVariables,
            useFunctions: problem.useFunctions,
        }

        console.log(problemInfo);
        console.log(game);

        const data = await this.problemService.create(problemInfo, game);
        
        res.status(200).json({
            data,
            success: true,
            message: "Successfully Saved"
        });
    };

    private getProblemStatuses = async (req: Request, res: Response) => {
        const statuses = await this.problemService.getStatusList();
        res.json({
            success: true,
            statuses
        })
    }

    private test = async (req: Request, res: Response) => {
        this.problemService.test();

    }

}
