import { PayCycle, PayCycleProps } from '../entities/pay-cycle.entity';

export interface PayCycleRepositoryInterface {
  findMany({ conditions }: { conditions: any }): Promise<PayCycle[]>;
  findUnique({ conditions }: { conditions: any }): Promise<PayCycle | null>;
  create(payCycle: PayCycleProps): Promise<PayCycle>;
  update(id: string, payCycle: Partial<PayCycleProps>): Promise<PayCycle>;
  delete(id: string): Promise<boolean>;
}
