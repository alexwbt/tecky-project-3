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
        router.get("/profile/:username", catcher(this.getProfile));
        return router;
    }

    private login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                success: false,
                message: "Username and Password Required"
            });
            return;
        }
        const user = await this.service.getUserWithUsername(username);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Unknown Username"
            });
            return;
        }
        if (!checkPassword(password, user.password)) {
            res.status(400).json({
                success: false,
                message: "Incorrect Password"
            });
            return;
        }
        res.status(200).json({
            success: true,
            token: getToken(user.id, user.username)
        });
    };

    private register = async (req: Request, res: Response) => {
        const { email, username, password, cpassword } = req.body;
        if (!email || !username || !password) {
            res.status(400).json({
                success: false,
                message: "Email, Username and Password Required"
            });
            return;
        }
        const userId = await this.service.getUserIdWithEmail(email);
        const user = await this.service.getUserWithUsername(username);
        if (user || userId) {
            res.status(400).json({
                success: false,
                message: "Email or Username has been taken"
            });
            return;
        }
        if (password != cpassword) {
            res.status(400).json({
                success: false,
                message: "Password confirmation doesn't match Password"
            });
            return;
        }
        await this.service.register(email, username, await hashPassword(password));
        res.status(200).json({
            success: true
        });
    };

    private getProfile = async (req: Request, res: Response) => {
        const { username } = req.params;
        if (!username) {
            res.status(400).json({
                success: false,
                message: "Username Required"
            });
            return;
        }
        const user = await this.service.getUserWithUsername(username);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Unknown Username"
            });
            return;
        }
        const profile = await this.service.getProfileWithId(user.id);
        if (!profile) {
            throw new Error("User Profile Not Found");
        }
        res.status(200).json({
            success: true,
            username: user.username,
            email: profile.email,
            exp: profile.experience
        });
    };

}
