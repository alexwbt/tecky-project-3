import { Router, Request, Response } from "express";
import { catcher } from "../main";
import ProblemService from "../services/ProblemService";


export default class ProblemRouter {

    constructor(private service: ProblemService) { }

    router() {
        const router = Router();
        router.post("/", catcher(this.uploadProblem));
        return router;
    }

    private uploadProblem = async (req: Request, res: Response) => {
        res.status(200).json({
            success: true,
            message: "Successfully Saved"
        });
    };

}
