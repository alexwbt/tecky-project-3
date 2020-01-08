import { Router, Request, Response } from "express";
import { catcher } from "../main";
import { isLoggedIn } from "./passport";
import ProblemService from "../services/ProblemService";

import { MongoClient } from "mongodb";

export default class ProblemRouter {

    constructor(private service: ProblemService, private mongoClient: MongoClient) { }

    router() {
        const router = Router();
        router.post("/", isLoggedIn, catcher(this.uploadProblem));
        router.get("/test/", catcher(this.test));
        return router;
    }

    private uploadProblem = async (req: Request, res: Response) => {

        res.status(200).json({
            success: true,
            message: "Successfully Saved"
        });
    };

    private test = async (req: Request, res: Response) => {
        await this.mongoClient.connect();
        const db = this.mongoClient.db(process.env.MONGO_DB_NAME);
        const collection = db.collection("test");
        const data = await collection.find({}).toArray();
        console.log(data);
        this.mongoClient.close();
        
    }

}
