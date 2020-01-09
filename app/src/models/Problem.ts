import { ICategory } from "./Category";
import { IDifficulty } from "./Difficulty";

export interface IProblem {
    title: string;
    category: ICategory | null;
    difficulty: IDifficulty | null;
    status: IProblemStatus | null;
}

export interface IProblemInfo extends IProblem {
    description: string;
    score: number;
    deduction: IProblemDeduction[] | null;
}

export interface IProblemStatus {
    id: number;
    name: string;
}

export interface IProblemDeduction {
    id: number;
    title: string;
    deduct: number;
}

