import { Router, Request, Response } from "express";
import { catcher } from "../middleware";
import { isLoggedIn } from "../passport";
import ProblemService from "../services/ProblemService";

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
        res.status(200).json({
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
