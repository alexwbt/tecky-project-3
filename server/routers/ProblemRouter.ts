import { Router, Request, Response, json } from "express";
import * as multer from 'multer';
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProblemService from "../services/ProblemService";
import UserService from "../services/UserService";

export default class ProblemRouter {

    constructor(private service: ProblemService, private userService: UserService, private upload: multer.Instance) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.createProblem));
        router.put("/", isLoggedIn, this.upload.single("image"), catcher(this.editProblem));
        router.post("/rate", isLoggedIn, catcher(this.rateProblem));
        router.get("/userRating/:problemID", isLoggedIn, catcher(this.getProblemRatingOfUser));
        router.get("/statuses/", catcher(this.getProblemStatuses));
        router.get("/creator/:problemID", isLoggedIn, catcher(this.getProblemAsCreator));
        router.get("/:problemID", catcher(this.getProblem));
        router.get("/", catcher(this.getProblemList));

        router.get("/test/", catcher(this.test));
        return router;
    }

    private getProblemList = async (req: Request, res: Response) => {
        const list = await this.service.getProblemList();
        for (let i = 0; i < list.length; i++) {
            list[i].user = (await this.userService.getUsernameWithId(list[i].user_id))?.username;
            list[i].user_id = undefined;
        }
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
        const success = await this.service.editProblem(
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

        if (success) {
            res.status(200).json({
                success: true,
                message: "Successfully Saved"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "You are not the creator of this challenge."
            });
        }
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

        content.code = "";

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

    private getProblemAsCreator = async (req: Request, res: Response) => {
        const { problemID } = req.params;
        if (!problemID) {
            res.status(400).json({
                success: false,
                message: "Challege ID Required"
            });
            return;
        }

        const user = await this.userService.getProfileWithId(req.user["id"]);
        const id = parseInt(problemID);
        const info = await this.service.getProblemInfo(id);
        const content = await this.service.getProblemContent(id);

        if (!user || (user.user_id !== info.user_id && user.role_id !== 1)) {
            res.status(401).json({
                success: false,
                message: "You are not suppose to edit this challenge."
            });
            return;
        }

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
        res.status(200).json({
            success: true,
            message: "Successfully rated challenge"
        });
    };

    private getProblemRatingOfUser = async (req: Request, res: Response) => {
        const { problemID } = req.params;

        if (!problemID) {
            res.status(500).json({
                success: false,
                message: "Problem ID Required"
            });
            return;
        }

        const rating = await this.service.getProblemRatingOfUser(req.user["id"], parseInt(problemID));
        res.status(200).json({
            success: true,
            rating: rating ? rating.rating : 0
        });
    }

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
