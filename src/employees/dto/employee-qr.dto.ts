import { Type } from 'class-transformer';
import { IsInt, IsPositive, IsString } from 'class-validator';

export class GenerateEmployeeQrDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  id_employee: number;
}

export class ScanEmployeeQrDto {
  @IsString()
  qrToken: string;
}
