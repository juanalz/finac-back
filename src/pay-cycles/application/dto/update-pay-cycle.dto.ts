import { PartialType } from '@nestjs/swagger';
import { CreatePayCycleDto } from './create-pay-cycle.dto';

export class UpdatePayCycleDto extends PartialType(CreatePayCycleDto) {}
