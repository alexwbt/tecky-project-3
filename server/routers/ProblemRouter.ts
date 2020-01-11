import { Router, Request, Response, json } from "express";
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProblemService from "../services/ProblemService";

export default class ProblemRouter {

    constructor(private service: ProblemService) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.createProblem));
        router.put("/", isLoggedIn, catcher(this.editProblem));
        router.get("/:problemID", catcher(this.getProblem));

        router.get("/statuses/", catcher(this.getProblemStatuses));
        router.get("/test/", catcher(this.test));
        return router;
    }

    private createProblem = async (req: Request, res: Response) => {
        const problemID = this.service.createProblem(req.user["id"]);
        res.status(200).json({
            success: true,
            problemID
        });
    };

    private editProblem = async (req: Request, res: Response) => {
        const {
            // Description
            title,
            description,
            categoryID,
            difficultyID,
            statusID,
            score,
            maxUsedBlocks,
            maxMoveTimes,
            deduction,

            // Editor
            canvas,
            code,
            avalibleBlocks,
            avalibleCategories,
            useCategory,
            useVariables,
            useFunctions,
        } = req.body.problem;
        if (
            !req.body.problemID
            // Description
            || !title
            || !description
            || !categoryID
            || !difficultyID
            || !statusID
            || !score
            || !maxUsedBlocks
            || !maxMoveTimes
            || !deduction
            // Editor
            || !canvas
            || !code
            || !avalibleBlocks
            || !avalibleCategories
            || !useCategory
            || !useVariables
            || !useFunctions
        ) {
            res.status(400).json({
                success: false,
                message: "Missing Requirements"
            });
            return;
        }

        const problemID = await this.service.editProblem(
            req.body.problemID,

            title,
            description,
            categoryID,
            difficultyID,
            statusID,
            score,
            // maxUsedBlocks,
            // maxMoveTimes,
            // deduction,

            {
                canvas: req.body.problem.canvas,
                code: req.body.problem.code,
                avalibleBlocks: req.body.problem.avalibleBlocks,
                avalibleCategories: req.body.problem.avalibleCategories,
                useCategory: req.body.problem.useCategory,
                useVariables: req.body.problem.useVariables,
                useFunctions: req.body.problem.useFunctions,
            }
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

        const id = parseInt(problemID);
        const info = await this.service.getProblemInfo(id);
        const content = await this.service.getProblemInfo(id);

        if (info && content) {
            res.status(200).json({
                success: true,
                problem: {
                    title: info.title,
                    description: info.description,

                }
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
