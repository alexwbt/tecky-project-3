import { Router, Request, Response } from "express";
import { catcher } from "../middleware";
import { getToken, isLoggedIn } from "../passport";
import { checkPassword, hashPassword } from "../hash";
import UserService from "../services/UserService";


export default class UserRouter {

    constructor(private service: UserService) { }

    router() {
        const router = Router();
        router.post("/login", catcher(this.login));
        router.post("/register", catcher(this.register));
        router.get("/profile/:username", catcher(this.getProfile));
        router.get("/leaderBoard", catcher(this.getProfile));
        router.get("/auditList", catcher(this.getProfile));
        router.get("/role", isLoggedIn, catcher(this.getRole));
        router.get("/rankingList", isLoggedIn, catcher(this.getRankingList));
        return router;
    }

    private getRole = async (req: Request, res: Response) => {
        const user = await this.service.getProfileWithId(req.user["id"]);
        if (!user) {
            res.status(400).json({
                success: false,
                message: "Failed to get user"
            });
            return;
        }
        res.status(200).json({
            success: true,
            role: user.role_id
        });
    };

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
            token: getToken(user.id, user.username),
            role: (await this.service.getProfileWithId(user.id)).role_id
        });
    };

    private register = async (req: Request, res: Response) => {
        const { email, username, password, cpassword, year } = req.body;
        if (!email || !username || !password || !year) {
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
        await this.service.register(email, username, await hashPassword(password), year);
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
            res.status(400).json({
                success: false,
                message: "User Profile Not Found"
            });
            return;
        }

        const location = await this.service.getLocationWithId(user.id);
        if (!location) {
            res.status(400).json({
                success: false,
                message: "User Location Not Found"
            });
            return;
        }

        const getPublishedPostsRecord = await this.service.getPublishedPostsRecord(user.id);
        if (!getPublishedPostsRecord) {
            res.status(400).json({
                success: false,
                message: "Unable to get posts records"
            });
            return;
        }

        const postsRecord = await this.service.getOwnPostsRecord(user.id);
        if (!postsRecord) {
            res.status(400).json({
                success: false,
                message: "Unable to get posts records"
            });
            return;
        }

        const solvedRecord = await this.service.getSolvedRecord(user.id);
        if (!solvedRecord) {
            res.status(400).json({
                success: false,
                message: "Unable to get solved records"
            });
            return;
        }

        res.status(200).json({
            success: true,
            username: user.username,
            email: profile.email,
            exp: profile.experience,
            level: profile.level,
            location: location.name,
            getPublishedPostsRecord,
            postsRecord,
            solvedRecord
        });
    };

    private getRankingList = async (req: Request, res: Response) => {
        const rankingList = await this.service.getRankingList();
        if (!rankingList) {
            res.status(400).json({
                success: false,
                message: "Failed to get ranking list"
            });
            return;
        }
        res.status(200).json({
            success: true,
            rankingList
        });
    };

}
