import { UserService } from "../services/UserService";
import { Router, Request, Response } from "express";
import * as passport from "passport";
import { loginFlow, isLoggedOut, isLoggedIn } from "../guards";


export class UserRouter {

    constructor(private service: UserService) { }

    router() {
        const router = Router();
        router.post("/login", isLoggedOut, (...rest) => passport.authenticate("local", loginFlow(...rest))(...rest));
        router.post("/logout", isLoggedIn, this.logout);
        router.post("/register", isLoggedOut, this.register);
        return router;
    }

    logout = (req: Request, res: Response) => {
        if (req.session) {
            req.session.destroy(() => {
                res.status(200).json({
                    result: true,
                    message: "Successfully logged out"
                });
            });
        }
    }

    register = async (req: Request, res: Response) => {
        try {
            let { email, username, password } = req.body;
            if (!email || !username || !password) {
                res.status(400).json({
                    result: false,
                    message: "Bad Request"
                });
                return;
            }
            const result = await this.service.register(email, username, password);
            if (result) {
                res.status(200).json({
                    result: true,
                    message: "Successfully registered"
                });
            } else {
                res.status(400).json({
                    result: true,
                    message: "Duplicate email or username"
                });
            }
        } catch (err) {
            res.status(500).json({
                result: false,
                message: err.message
            });
        }
    }

}
