import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from "../../../prisma/prisma-client/client";
import { PayCycle, PayCycleProps } from 'src/pay-cycles/domain/entities/pay-cycle.entity';
import { PayCycleRepositoryInterface } from 'src/pay-cycles/domain/repositories/pay-cycle.repository-interface';

@Injectable()
export class PayCyclePrismaRepository implements PayCycleRepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findMany({ conditions }: { conditions: Prisma.PayCycleWhereInput }): Promise<PayCycle[]> {
    const records = await this.prisma.payCycle.findMany({ where: conditions });
    return records.map(r => PayCycle.fromPrisma(r as unknown as PayCycleProps));
  }

  async findUnique({ 
      conditions 
    }: { 
      conditions: Prisma.PayCycleWhereInput; 
    }): Promise<PayCycle | null> {
    const payCycle = await this.prisma.payCycle.findFirst({ 
      where: conditions, 
      orderBy: { id: 'asc' } 
    });

    if (!payCycle) return null;

    return PayCycle.fromPrisma(payCycle as PayCycleProps);
  }

  async create(payCycle: PayCycleProps): Promise<PayCycle> {
    const record = await this.prisma.payCycle.create({
      data: payCycle as any,
    });
    return PayCycle.fromPrisma(record as unknown as PayCycleProps);
  }

  async update(id: string, payCycle: Partial<PayCycleProps>): Promise<PayCycle> {
    const record = await this.prisma.payCycle.update({
      where: { id },
      data: payCycle as any,
    });
    return PayCycle.fromPrisma(record as unknown as PayCycleProps);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.payCycle.delete({ where: { id } });
    return true;
  }
}
