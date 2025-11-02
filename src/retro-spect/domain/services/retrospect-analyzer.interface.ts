import { Analysis } from '../value-objects';

export interface RetrospectAnalysisInput {
  goal: {
    id: string;
    title: string;
    description?: string;
  };
  retrospects: Array<{
    id: string;
    content: string;
    kpt?: {
      keep?: string;
      problem?: string;
      try?: string;
    };
  }>;
  todos: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
}

export interface RetrospectAnalyzer {
  generateAnalysis(input: RetrospectAnalysisInput): Promise<Analysis>;
}
