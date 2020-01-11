import { Router, Request, Response, json } from "express";
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProblemService from "../services/ProblemService";

export default class ProblemRouter {

    constructor(private service: ProblemService) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.createProblem));
        router.get("/:problemID", catcher(this.getProblem));

        router.get("/statuses/", catcher(this.getProblemStatuses));
        router.get("/test/", catcher(this.test));
        return router;
    }

    private createProblem = async (req: Request, res: Response) => {
        const { title, description, categoryID, difficultyID, statusID, score, } = req.body.problem;
        if (!title || !description || !categoryID || !difficultyID || !statusID || !score) {
            res.status(400).json({
                success: false,
                message: "Bad Request"
            });
            return;
        }

        const game = {
            canvas: req.body.problem.canvas,
            code: req.body.problem.code,
            avalibleBlocks: req.body.problem.avalibleBlocks,
            avalibleCategories: req.body.problem.avalibleCategories,
            useCategory: req.body.problem.useCategory,
            useVariables: req.body.problem.useVariables,
            useFunctions: req.body.problem.useFunctions,
        };

        const problemID = await this.service.createProblem(
            title,
            description,
            score,
            categoryID,
            difficultyID,
            statusID,
            game
        );

        res.status(200).json({
            success: true,
            message: "Successfully Saved",
            problemID
        });
    };

    private getProblem = async (req: Request, res: Response) => {
        const { problemID } = req.params;
        if (!problemID) {
            res.status(400).json({
                success: false,
                message: "Challege ID Required"
            });
            return;
        }

        const problem = this.service.getProblem(parseInt(problemID));

        if (problem) {
            res.status(200).json({
                success: true,
                problem
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to get Challenge"
            });
        }
    };

    // Get Static Table
    private getProblemStatuses = async (req: Request, res: Response) => {
        const statuses = await this.service.getStatusList();
        res.json({
            success: true,
            statuses
        })
    };

    private getProblemCategories = async (req: Request, res: Response) => {

    };

    private getProblemDifficulties = async (req: Request, res: Response) => {

    };

    private test = async (req: Request, res: Response) => {
        this.service.test();

    };

}
