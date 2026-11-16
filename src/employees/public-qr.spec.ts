import { BadRequestException, NotFoundException, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { GenerateEmployeeQrDto, ScanEmployeeQrDto } from './dto/employee-qr.dto';

jest.mock('../config', () => ({ envs: { qrTokenSecret: 'local-test-qr-secret' } }));
jest.mock('../lib/supabase/supabase', () => ({ supabase: {} }));
jest.mock('../lib/prisma', () => ({ PrismaService: class {} }));

describe('QR público de empleados', () => {
  const employee = {
    id_employee: 10, first_name: 'Juan', last_name: 'Perez', age: 30,
    email: 'employee@example.com', code: 1001, status: 'active',
    id_position: 7, photo_url: null, id_manager: 1, id_administrator: 1,
  };
  const prisma = { employees: { findUnique: jest.fn() } };
  let service: UsersService;

  beforeEach(() => {
    prisma.employees.findUnique.mockReset().mockResolvedValue(employee);
    service = new UsersService({} as never, prisma as never);
  });

  it('acepta los payloads públicos con la validación usada por NATS', async () => {
    const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true });
    await expect(pipe.transform({ id_employee: 10 }, { type: 'body', metatype: GenerateEmployeeQrDto }))
      .resolves.toBeDefined();
    await expect(pipe.transform({ qrToken: 'qr-value' }, { type: 'body', metatype: ScanEmployeeQrDto }))
      .resolves.toBeDefined();
  });

  it('genera y lee todos los datos sin identidad, cargo ni token de sesión', async () => {
    const { qrToken } = await service.generateEmployeeQr({ id_employee: 10 });
    const result = await service.scanEmployeeQr({ qrToken });
    expect(result).toMatchObject({ enabled: true, visibilityLevel: 'full', employee });
  });

  it('mantiene el error de empleado inexistente', async () => {
    prisma.employees.findUnique.mockResolvedValue(null);
    await expect(service.generateEmployeeQr({ id_employee: 999 })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rechaza contenido QR manipulado', async () => {
    const { qrToken } = await service.generateEmployeeQr({ id_employee: 10 });
    await expect(service.scanEmployeeQr({ qrToken: `${qrToken}modified` }))
      .rejects.toBeInstanceOf(BadRequestException);
  });

  it('mantiene la caducidad del QR', async () => {
    const clock = jest.spyOn(Date, 'now');
    try {
      const now = Date.now();
      clock.mockReturnValue(now);
      const { qrToken } = await service.generateEmployeeQr({ id_employee: 10 });
      clock.mockReturnValue(now + 16 * 60 * 1000);
      await expect(service.scanEmployeeQr({ qrToken })).rejects.toBeInstanceOf(UnauthorizedException);
    } finally {
      clock.mockRestore();
    }
  });
});
