import { Router, Request, Response } from "express";
import * as multer from 'multer';
import { catcher, isAdmin } from "../middleware";
import AuditService from "../services/AuditService";
import ProblemService from "../services/ProblemService";

export default class AuditRouter {
    constructor(private service: AuditService, private problemService: ProblemService, private upload: multer.Instance) { }

    router() {
        const router = Router();
        router.get("/", isAdmin, catcher(this.getAuditList));
        router.put("/", isAdmin, this.upload.single("image"), catcher(this.editProblem));
        return router;
    }

    private getAuditList = async (req: Request, res: Response) => {
        const list = await this.service.getAuditList();
        if (list) {
            res.status(200).json({
                success: true,
                list
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Failed to get audit list"
            });
        }
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
            reason,

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
            || reason === undefined
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
        const success = await this.service.updateAudit(
            req.user["id"],
            pid,
            title,
            description,
            categoryID < 1 ? 1 : categoryID,
            difficultyID < 1 ? 1 : difficultyID,
            statusID < 1 ? 1 : statusID,
            score,
            game,
            reason
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
    }
}