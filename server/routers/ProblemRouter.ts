import { Router, Request, Response, json } from "express";
import * as multer from 'multer';
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProblemService from "../services/ProblemService";

export default class ProblemRouter {

    constructor(private service: ProblemService, private upload: multer.Instance) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.createProblem));
        router.put("/", isLoggedIn, this.upload.single("image"), catcher(this.editProblem));
        router.post("/rate", isLoggedIn, catcher(this.rateProblem));
        router.get("/statuses/", catcher(this.getProblemStatuses));
        router.get("/:problemID", catcher(this.getProblem));
        router.get("/", catcher(this.getProblemList));

        router.get("/test/", catcher(this.test));
        return router;
    }

    private getProblemList = async (req: Request, res: Response) => {
        const list = await this.service.getProblemList();
        res.status(200).json({
            success: true,
            problemList: list
        });
    };

    private createProblem = async (req: Request, res: Response) => {
        const problemID = await this.service.createProblem(req.user["id"]);
        res.status(200).json({
            success: true,
            message: "Successfully created challenge",
            problemID
        });
    };

    private editProblem = async (req: Request, res: Response) => {
        const problem = JSON.parse(req.body.problem);

        const {
            pid,
            // Description
            title,
            description,
            categoryID,
            difficultyID,
            statusID,
            score,

            // Editor
            canvas,
            code,
            avalibleBlocks,
            avalibleCategories,
            useCategory,
            useVariables,
            useFunctions,
        } = problem;
        if (
            pid === undefined
            // Description
            || title === undefined
            || description === undefined
            || categoryID === undefined
            || difficultyID === undefined
            || statusID === undefined
            || score === undefined
            // Editor
            || canvas === undefined
            || code === undefined
            || avalibleBlocks === undefined
            || avalibleCategories === undefined
            || useCategory === undefined
            || useVariables === undefined
            || useFunctions === undefined
        ) {
            res.status(400).json({
                success: false,
                message: "Missing Requirements"
            });
            return;
        }
        const game = {
            canvas: problem.canvas,
            code: problem.code,
            avalibleBlocks: problem.avalibleBlocks,
            avalibleCategories: problem.avalibleCategories,
            useCategory: problem.useCategory,
            useVariables: problem.useVariables,
            useFunctions: problem.useFunctions,
            winningCondition: problem.winningCondition,
            maxUsedBlocks: problem.maxUsedBlocks,
            maxMoveTimes: problem.maxMoveTimes,
            deduction: problem.deduction
        };
        const problemID = await this.service.editProblem(
            req.user["id"],
            pid,
            title,
            description,
            categoryID < 1 ? 1 : categoryID,
            difficultyID < 1 ? 1 : difficultyID,
            statusID < 1 ? 1 : statusID,
            score,
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

        const id = parseInt(problemID);
        const info = await this.service.getProblemInfo(id);
        const content = await this.service.getProblemContent(id);

        if (info && content) {
            res.status(200).json({
                success: true,
                problem: {
                    title: info.title,
                    description: info.description,
                    categoryID: info.category_id,
                    difficultyID: info.difficulty_id,
                    statusID: info.status_id,
                    score: info.score,
                    // maxUsedBlocks: 0,
                    // maxMoveTimes: 0,
                    // deduction: null,
                    ...content
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to get Challenge"
            });
        }
    };

    private rateProblem = async (req: Request, res: Response) => {
        const { problemID, score } = req.body;

        if (!problemID || !score) {
            res.status(500).json({
                success: false,
                message: "Problem ID and Score Required"
            });
            return;
        }

        await this.service.rateProblem(req.user["id"], problemID, Math.min(5, Math.max(1, score)));
        res.json(200).json({
            success: true,
            message: "Successfully rated challenge"
        });
    };

    // Get Static Table
    private getProblemStatuses = async (req: Request, res: Response) => {
        const statuses = await this.service.getStatusList();
        res.json({
            success: true,
            statuses
        });
    };

    private getProblemCategories = async (req: Request, res: Response) => {

    };

    private getProblemDifficulties = async (req: Request, res: Response) => {

    };

    private test = async (req: Request, res: Response) => {
        this.service.test();

    };

}
