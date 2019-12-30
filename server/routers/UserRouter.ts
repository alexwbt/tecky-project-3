import { Router, Request, Response } from "express";
import { catcher } from "../main";
import { getToken } from "../passport";
import { checkPassword } from "../hash";
import UserService from "../services/UserService";


export default class UserRouter {

    constructor(private service: UserService) { }

    router() {
        const router = Router();
        router.post("/login", catcher(this.login));
        return router;
    }

    private login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                result: false,
                message: "Username and Password Required"
            });
            return;
        }
        const user = await this.service.getUserWithUsername(username);
        if (!user) {
            res.status(400).json({
                result: false,
                message: "Unknown Username"
            });
            return;
        }
        if (!checkPassword(password, user.password)) {
            res.status(400).json({
                result: false,
                message: "Incorrect Password"
            });
            return;
        }
        res.status(200).json({
            result: true,
            token: getToken(user.id, user.username)
        });
    };

}
