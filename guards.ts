import { Request, Response, NextFunction } from "express";


export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user["id"]) {
        next();
    } else {
        res.status(400).json({
            result: false,
            message: "Login required"
        });
    }
}

export function isLoggedOut(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user["id"]) {
        res.status(400).json({
            result: false,
            message: "Logout Required"
        });
    } else {
        next();
    }
}

export function loginFlow(req: Request, res: Response, next: NextFunction) {
    return (err: Error, user: any, info: { message: string }) => {
        if (err) {
            res.status(400).json({
                result: false,
                message: err.message
            });
        } else if (info && info.message) {
            res.status(400).json({
                result: false,
                message: info.message
            });
        } else {
            req.logIn(user, err => {
                if (err) {
                    res.status(400).json({
                        result: false,
                        message: "Failed to login"
                    });
                } else {
                    res.status(200).json({
                        result: true,
                        message: "Successfully logged in"
                    });
                }
            });
        }
    };
}
