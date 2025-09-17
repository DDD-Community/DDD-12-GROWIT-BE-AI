export interface CreateGoalRecommendationCommand {
  userId: string;
  promptId: string;
  input: string; // JSON string
}

export interface UpdateGoalRecommendationCommand {
  id: string;
  output: string;
}

export interface GetGoalRecommendationCommand {
  id: string;
}

export interface ListGoalRecommendationsCommand {
  userId?: string;
  promptId?: string;
  limit?: number;
  offset?: number;
}
