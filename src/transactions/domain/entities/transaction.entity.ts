import { Category } from "src/prisma/prisma-client/client";

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface TransactionProps {
  id?: string;
  concept: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId?: string;
  category?: Category;
}

export class Transaction {
  public readonly id?: string;
  public readonly concept: string;
  public readonly amount: number;
  public readonly type: TransactionType;
  public readonly date: string;
  public readonly categoryId?: string;
  public readonly category?: Category;

  constructor(props: TransactionProps) {
    this.id = props.id;
    this.concept = props.concept;
    this.amount = props.amount;
    this.type = props.type;
    this.date = props.date;
    this.categoryId = props.categoryId;
    this.category = props.category;
  }

  static fromPrisma(data: TransactionProps): Transaction {
    return new Transaction(data);
  }
}
