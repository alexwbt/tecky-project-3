import { Router, Request, Response } from "express";
import { catcher } from "../main";
import { getToken } from "../passport";
import { checkPassword, hashPassword } from "../hash";
import UserService from "../services/UserService";


export default class UserRouter {

    constructor(private service: UserService) { }

    router() {
        const router = Router();
        router.post("/login", catcher(this.login));
        router.post("/register", catcher(this.register));
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

    private register = async (req: Request, res: Response) => {
        const { email, username, password, cpassword } = req.body;
        if (!email || !username || !password) {
            res.status(400).json({
                result: false,
                message: "Email, Username and Password Required"
            });
            return;
        }
        const userId = await this.service.getUserIdWithEmail(email);
        const user = await this.service.getUserWithUsername(username);
        if (user || userId) {
            res.status(400).json({
                result: false,
                message: "Email or Username has been taken"
            });
            return;
        }
        if (password != cpassword) {
            res.status(400).json({
                result: false,
                message: "Password confirmation doesn't match Password"
            });
            return;
        }
        await this.service.register(email, username, await hashPassword(password));
        res.status(200).json({
            result: true
        });
    };

}
