import { Inject, Injectable } from "@nestjs/common";
import csv from 'csv-parser';
import { Readable } from 'stream';
import { Transaction } from "src/transactions/domain/entities/transaction.entity";
import { PaydayType } from 'src/pay-cycles/domain/entities/pay-cycle.entity';
import { PayCycleRepositoryInterface } from "src/pay-cycles/domain/repositories/pay-cycle.repository-interface";
import { TransactionRepositoryInterface } from "src/transactions/domain/repositories/transaction.repository-interface";

@Injectable()
export class UploadFileFlatUseCase {
    constructor(
        @Inject('PayCycleRepositoryInterface')
        private readonly payCycleRepository: PayCycleRepositoryInterface,
        @Inject('TransactionRepositoryInterface')
        private readonly transactionRepository: TransactionRepositoryInterface,
    ) {}

    // @ts-ignore
    async execute(file: Express.Multer.File) {
    const transactions: Transaction[] = [];

    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(
          csv({
            separator: ';', // 👈 delimitador personalizado
            mapHeaders: ({ header }) => header ? header.trim().toLowerCase() : '',
          }),
        )
        .on('data', (data: Transaction) => {
          // Validación básica
          const categoryId = (data as any).categoryid?.trim();
          if (data) {
            transactions.push({
              date: data.date.trim(),
              concept: data.concept.trim(),
              amount: Number(data.amount),
              type: data.concept.trim() === 'Pago Nómina Indra' ? 'INCOME' : 'EXPENSE',
              categoryId: categoryId !== '' ? categoryId : '5f5097e6-9ae3-428c-8176-2d5a66d9061a',
            }as Transaction);
          }
        })
        .on('end', async () => {
          try {
            if (transactions.length === 0) {
              return resolve({
                message: 'Archivo vacío o inválido',
              });
            }

            // const dates = transactions.reduce(
            //   (acc, item) => {
            //     const time = this.parseFecha(item.date);
            //     if (isNaN(time)) return acc;

            //     if (!acc.min || time < acc.min.time) acc.min = { date: item.date, time };
            //     if (!acc.max || time > acc.max.time) acc.max = { date: item.date, time };

            //     return acc;
            //   },
            //   { min: null as any, max: null as any },
            // );

            // if (!dates.min || !dates.max) {
            //   return resolve({ message: 'No se pudieron calcular fechas válidas' });
            // }

            // await this.payCycleRepository.create({
            //   paydayType: PaydayType.FIXED,
            //   paydayValue: Number(dates.min.date.split('-')[2]),
            //   firstPaydate: dates.min.date,
            //   lastPayDate: dates.max.date,
            // });

            const baseDate = new Date();
            await this.transactionRepository.createMany(
              transactions.map((transaction, index) => { 

                const date = new Date(baseDate);
                date.setSeconds(date.getSeconds() + index);

                return {
                  ...transaction,
                  createdAt: date,
                  updatedAt: date,
                } 
              }),
            );

            resolve({
              message: 'Archivo procesado correctamente',
              totalLeidos: transactions.length,
              totalInsertados: 0,
            // totalInsertados: response.count,
            });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  private parseFecha(fecha: string): number {
    const [dia, mes, anio] = fecha.split('/');
    return new Date(`${anio}-${mes}-${dia}`).getTime();
  }
}