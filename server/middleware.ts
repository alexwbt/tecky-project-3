import { Request, Response, NextFunction } from "express";
import { userService } from './main';

export function catcher(routerFunction: (req: Request, res: Response, next?: NextFunction) => Promise<void>) {
    return async (req: Request, res: Response, next?: NextFunction) => {
        try {
            await routerFunction(req, res, next);
        } catch (err) {
            console.log(err.message);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: "Internal Server Error"
                });
            }
        }
        if (!res.headersSent) {
            console.log(req.originalUrl + " doesn't have a response.");
            res.status(500).json({
                success: false,
                message: "No Response"
            });
        }
    };
}

export async function isAdmin(req: Request, res: Response, next?: NextFunction) {
    if (req.user) {        
        const roleID = await userService.getUserRoleID(req.user['id']);        
        if (roleID === 1) {
            next();
        } else {
            res.status(401).json({
                success: false,
                message: "Only admin can access!"
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: "Only admin can access!"
        });
    }
}