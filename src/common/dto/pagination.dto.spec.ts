import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  it('usa pagina 1 y limite 10 por defecto', () => {
    const dto = new PaginationDto();
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });

  it('acepta un objeto vacio (los dos campos son opcionales)', async () => {
    const dto = plainToInstance(PaginationDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });

  it('convierte textos a numeros (asi llegan los query params)', async () => {
    const dto = plainToInstance(PaginationDto, { page: '2', limit: '5' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(5);
  });

  it('rechaza una pagina menor o igual a cero', async () => {
    const dto = plainToInstance(PaginationDto, { page: '0' });
    const errors = await validate(dto);
    expect(errors.map((e) => e.property)).toContain('page');
  });

  it('rechaza un limite negativo', async () => {
    const dto = plainToInstance(PaginationDto, { limit: '-5' });
    const errors = await validate(dto);
    expect(errors.map((e) => e.property)).toContain('limit');
  });

  it('rechaza valores que no son numeros', async () => {
    const dto = plainToInstance(PaginationDto, { page: 'abc' });
    const errors = await validate(dto);
    expect(errors.map((e) => e.property)).toContain('page');
  });
});
