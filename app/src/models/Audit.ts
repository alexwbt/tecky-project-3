export interface IAudit {
    id: number;
    problem_id: number;
    status: boolean;
    reason: string;
    user_id: number;
}