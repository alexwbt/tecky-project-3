import { Router, Request, Response } from "express";
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProgressService from '../services/ProgressService';

export default class ProblemRouter {

    constructor(private service: ProgressService) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.submitProgress));
        return router;
    }

    private submitProgress = async (req: Request, res: Response) => {
        const { problemID, score } = req.body;
        if (problemID === undefined || score === undefined) {
            res.status(400).json({
                success: false,
                message: "Missing Requirements"
            });
            return;
        }

        const experience = await this.service.insertOrUpdateProgress(req.user["id"], problemID, score);
        res.status(200).json({
            success: true,
            message: "Successfully Saved",
            experience
        });
    }
}