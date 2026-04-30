export enum PaydayType {
  FIXED = 'FIXED',
  LAST = 'LAST',
}

export interface PayCycleProps {
  id?: string;
  paydayType: PaydayType;
  paydayValue: number;
  firstPaydate: string;
  lastPayDate: string;
}

export class PayCycle {
  public readonly id?: string;
  public readonly paydayType: PaydayType;
  public readonly paydayValue: number;
  public readonly firstPaydate: string;
  public readonly lastPayDate: string;

  constructor(props: PayCycleProps) {
    this.id = props.id;
    this.paydayType = props.paydayType;
    this.paydayValue = props.paydayValue;
    this.firstPaydate = props.firstPaydate;
    this.lastPayDate = props.lastPayDate;
  }

  static fromPrisma(data: PayCycleProps): PayCycle {
    return new PayCycle(data);
  }
}
