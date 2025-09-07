export class AiRole {

  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly personality: string,
    public readonly command: string,
    public readonly capabilities: readonly string[],
    public readonly isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

}
