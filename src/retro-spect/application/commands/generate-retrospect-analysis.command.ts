export class GenerateRetrospectAnalysisCommand {
  constructor(
    public readonly goalId: string,
    public readonly content: string,
    public readonly goal: {
      id: string;
      title: string;
      description?: string;
    },
    public readonly retrospects: Array<{
      id: string;
      content: string;
      kpt?: {
        keep?: string;
        problem?: string;
        try?: string;
      };
    }>,
    public readonly todos: Array<{
      id: string;
      title: string;
      completed: boolean;
    }>,
  ) {}
}
