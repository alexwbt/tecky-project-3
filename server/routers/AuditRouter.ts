import { Router, Request, Response } from "express";
import { catcher } from "../middleware";

import AuditService from "../services/AuditService";

export default class AuditRouter {
    constructor(private auditService: AuditService) {}

    router() {
        const router = Router();
        router.put("/:id", catcher(this.editProblem));
        return router;
    }

    async editProblem(req: Request, res: Response) {
        
    }
}