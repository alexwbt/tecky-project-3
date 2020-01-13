
export interface IProblem {
    title: string;
    categoryID: number;
    difficultyID: number;
    statusID: number;
}

export interface IProblemInfo extends IProblem {
    description: string;
    score: number;
    image?: File;

    maxUsedBlocks: number;
    maxMoveTimes: number;
    deduction: IProblemDeduction[];
}

export interface IProblemStatus {
    id: number;
    name: string;
}

export interface IProblemDeduction {
    id: number;
    deduct: number;
}

