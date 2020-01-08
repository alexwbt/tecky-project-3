import { Category } from "./Category";
import { Difficulty } from "./Difficulty";

export interface Problem {
    title: string;
    category: Category | null;
    difficulty: Difficulty | null;
    status: ProblemStatus | null;
}

export interface ProblemInfo extends Problem {
    description: string;
    score: number;
    deduction: Deduction[] | null;
}

export interface ProblemStatus {
    id: number;
    name: string;
}

export interface Deduction {
    id: number;
    title: string;
    deduct: number;
}

