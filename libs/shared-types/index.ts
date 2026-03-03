/**
 * Shared Type Definitions for AgenticSaaS
 * Used across Frontend, Orchestrator (if possible via proto), and AI Agent
 */

export enum TaskPhase {
    IDLE = "idle",
    PLANNING = "planning",
    RESEARCHING = "researching",
    STYLING = "styling",
    COMPLETED = "completed",
    FAILED = "failed"
}

export interface TaskProgressSignal {
    task_id: string;
    phase: TaskPhase;
    message: string;
    timestamp: string;
}

export interface UserProfile {
    id: string;
    email: string;
    avatar_url?: string;
}
