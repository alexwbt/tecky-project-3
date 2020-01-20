
export interface IProblem {
    title: string;
    categoryID: number;
    difficultyID: number;
    statusID: number;
}

export interface IProblemInfo extends IProblem {
    description: string;
    score: number;
    image: string;

    maxUsedBlocks: number;
    maxMoveTimes: number;
    deduction: IProblemDeduction[];

    reason: string;
}

export interface IProblemStatus {
    id: number;
    name: string;
}

export interface IProblemDeduction {
    id: number;
    deduct: number;
}

export enum ProblemStatus {
    WorkInProgress = 1,
    ReadyToAudit = 2,
    Rejected = 3,
    Published = 4,
}