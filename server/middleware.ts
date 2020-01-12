import { Request, Response, NextFunction } from "express";

// catcher
export function catcher(routerFunction: (req: Request, res: Response, next?: NextFunction) => Promise<void>) {
    return async (req: Request, res: Response, next?: NextFunction) => {
        try {
            await routerFunction(req, res, next);
        }
        catch (err) {
            console.log(err.message);
            res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
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
