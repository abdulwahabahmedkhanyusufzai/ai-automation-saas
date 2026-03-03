// types/workflow.ts
export interface WorkflowResponse {
    task_id: string;
    message: string;
}

export interface StatusResponse {
    status: "processing" | "completed";
    data?: {
        final_result: Array<{
            text: string;
            type: string;
        }>;
    };
}