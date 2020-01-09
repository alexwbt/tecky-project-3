import { Router, Request, Response } from "express";
import { catcher } from "../main";
import { isLoggedIn } from "../passport";
import ProblemService from "../services/ProblemService";

export default class ProblemRouter {

    constructor(private service: ProblemService) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.uploadProblem));
        router.get("/test/", catcher(this.test));
        return router;
    }

    private uploadProblem = async (req: Request, res: Response) => {
        
        res.status(200).json({
            success: true,
            message: "Successfully Saved"
        });
    };

    private test = async (req: Request, res: Response) => {
        this.service.test();
        
    }

}
