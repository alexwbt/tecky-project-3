import { Router, Request, Response } from "express";
import { catcher } from "../middleware";

import AuditService from "../services/AuditService";
import { isLoggedIn } from "../passport";
import UserService from "../services/UserService";

export default class AuditRouter {
    constructor(private service: AuditService, private userService: UserService) { }

    router() {
        const router = Router();
        router.get("/", isLoggedIn, catcher(this.getAuditList));
        router.put("/:id", catcher(this.editProblem));
        return router;
    }

    private getAuditList = async (req: Request, res: Response) => {
        const user = await this.userService.getProfileWithId(req.user["id"]);
        if (!user || user.role_id !== 1) {
            res.status(400).json({
                success: false,
                message: "You should not be getting this list"
            });
            return;
        }
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

    async editProblem(req: Request, res: Response) {

    }

}