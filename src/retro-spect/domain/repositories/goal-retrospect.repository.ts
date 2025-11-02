import { GoalRetrospectAggregate } from '../goal-retrospect.domain';

export interface GoalRetrospectRepository {
  save(goalRetrospect: GoalRetrospectAggregate): Promise<void>;
  findById(uid: string): Promise<GoalRetrospectAggregate | null>;
  findByGoalId(goalId: string): Promise<GoalRetrospectAggregate | null>;
  existsByGoalId(goalId: string): Promise<boolean>;
  delete(uid: string): Promise<void>;
}
