import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    format: 'uuid',
    description: 'The user who paid the expense.',
  })
  @IsDefined()
  @IsUUID('4')
  paidById!: string;

  @ApiProperty({
    format: 'uuid',
    description: 'The user who owes the expense.',
  })
  @IsDefined()
  @IsUUID('4')
  expenseForId!: string;

  @ApiProperty({ example: 42.5, minimum: 0.01, maximum: 999999999 })
  @Type(() => Number)
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number;

  @ApiProperty({ example: 'Dinner at Noma', maxLength: 120 })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  description!: string;
}
