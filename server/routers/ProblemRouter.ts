import { Router, Request, Response, json } from "express";\
import * as multer from 'multer';
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProblemService from "../services/ProblemService";

export default class ProblemRouter {

    constructor(private service: ProblemService, private upload:multer.Instance) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, this.upload.single("image"), catcher(this.createProblem));
        router.put("/", isLoggedIn, catcher(this.editProblem));
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
        } = req.body.problem;
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
            canvas: req.body.problem.canvas,
            code: req.body.problem.code,
            avalibleBlocks: req.body.problem.avalibleBlocks,
            avalibleCategories: req.body.problem.avalibleCategories,
            useCategory: req.body.problem.useCategory,
            useVariables: req.body.problem.useVariables,
            useFunctions: req.body.problem.useFunctions,
            winningCondition: req.body.problem.winningCondition,
            maxUsedBlocks: req.body.problem.maxUsedBlocks,
            maxMoveTimes: req.body.problem.maxMoveTimes,
            deduction: req.body.problem.deduction
        };
        const problemID = await this.service.editProblem(
            req.user["id"],
            pid,
            title,
            description,
            categoryID < 1 ? null : categoryID,
            difficultyID < 1 ? null : difficultyID,
            statusID < 1 ? null : statusID,
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
