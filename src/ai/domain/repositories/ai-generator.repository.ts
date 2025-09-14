export abstract class AIGeneratorRepository {
  abstract generateAdvice(prompt: string): Promise<string>;
  abstract generateGoal(prompt: string): Promise<string>;
}
