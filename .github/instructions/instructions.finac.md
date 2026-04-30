---
description: "Use when creating, scaffolding, or modifying NestJS modules in this project. Enforces Clean Architecture (DDD) with the exact folder structure, naming conventions, Prisma repository pattern, use-case-per-operation pattern, and Swagger/class-validator decorators used in the categories module."
applyTo: "src/**/*.ts"
---

# finac-back — Convenciones de Módulos NestJS (Clean Architecture)

## Estructura de carpetas obligatoria

Cada módulo vive en `src/{feature}/` y respeta esta estructura:

```
src/{feature}/
├── {feature}s.module.ts
├── domain/
│   ├── entities/
│   │   └── {feature}.entity.ts
│   └── repositories/
│       └── {feature}.repository-interface.ts
├── application/
│   ├── dto/
│   │   ├── create-{feature}.dto.ts
│   │   ├── update-{feature}.dto.ts
│   │   └── {feature}-response.dto.ts
│   └── services/
│       ├── create-{feature}.use-case.ts
│       ├── update-{feature}.use-case.ts
│       ├── delete-{feature}.use-case.ts
│       ├── find-all-{feature}s.use-case.ts
│       └── find-one-{feature}.use-case.ts
├── infrastructure/
│   └── persistence/
│       └── {feature}.repository.prisma.ts
└── presentation/
    └── {feature}s.controller.ts
```

## Entidad de dominio (`domain/entities/{feature}.entity.ts`)

- Define una `interface {Feature}Props` con todos los campos (opcionales cuando corresponda).
- La clase `{Feature}` tiene propiedades `public readonly`.
- Incluye un método estático `fromPrisma(data: {Feature}Props): {Feature}` para mapear desde Prisma.

```typescript
export interface {Feature}Props {
  id?: string;
  // ...campos
}

export class {Feature} {
  public readonly id?: string;
  // ...campos

  constructor(props: {Feature}Props) { ... }

  static fromPrisma(data: {Feature}Props): {Feature} {
    return new {Feature}({ ...data });
  }
}
```

## Interfaz de repositorio (`domain/repositories/{feature}.repository-interface.ts`)

Siempre define estos métodos con las firmas exactas:

```typescript
export interface {Feature}RepositoryInterface {
  findMany({ conditions }: { conditions: any }): Promise<{Feature}[]>;
  findUnique({ conditions, include }: { conditions: any; include?: any }): Promise<{Feature} | null>;
  create(item: {Feature}Props): Promise<{Feature}>;          // o createMany para bulk
  update(id: string, item: Partial<{Feature}>): Promise<{Feature}>;
  delete(id: string): Promise<boolean>;
}
```

## DTOs (`application/dto/`)

**Create DTO** — usa `class-validator` y Swagger en cada campo:
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class Create{Feature}Dto {
  @ApiProperty({ example: '...', description: '...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name: string;

  @ApiPropertyOptional({ example: '...', description: '...' })
  @IsOptional()
  optionalField?: string;
}
```

**Update DTO** — siempre extiende con `PartialType`:
```typescript
import { PartialType } from '@nestjs/swagger';
import { Create{Feature}Dto } from './create-{feature}.dto';
export class Update{Feature}Dto extends PartialType(Create{Feature}Dto) {}
```

**Response DTO** — constructor que recibe la entidad + método estático `fromEntities`:
```typescript
export class {Feature}ResponseDto {
  @ApiProperty({ ... }) id: string;
  // ...campos

  constructor(entity: {Feature}) {
    this.id = entity.id || '';
    // ...
  }

  static fromEntities(entity: {Feature}): {Feature}ResponseDto {
    return new {Feature}ResponseDto(entity);
  }
}
```

## Casos de uso (`application/services/`)

- Una clase por operación: `Create`, `Update`, `Delete`, `FindAll`, `FindOne`.
- `@Injectable()` con un único método `execute(...)`.
- Inyectar el repositorio con `@Inject('{Feature}RepositoryInterface')`.
- Lanzar `DomainException` para errores de negocio (import desde `src/modules/pino/domain/exceptions/domain.exception`).

```typescript
@Injectable()
export class Create{Feature}UseCase {
  constructor(
    @Inject('{Feature}RepositoryInterface')
    private readonly {feature}Repository: {Feature}RepositoryInterface,
  ) {}

  async execute(dto: Create{Feature}Dto): Promise<{Feature}ResponseDto> {
    // validación de negocio → throw new DomainException('...')
    const entity = await this.{feature}Repository.create({ ...dto });
    return {Feature}ResponseDto.fromEntities(entity);
  }
}
```

## Repositorio Prisma (`infrastructure/persistence/{feature}.repository.prisma.ts`)

- Clase `{Feature}PrismaRepository implements {Feature}RepositoryInterface`.
- Inyectar `PrismaService` con `@Inject(PrismaService)`.
- Mapear resultados con `{Feature}.fromPrisma(...)`.
- Manejar campos `nullable` de Prisma con `?? undefined` al mapear.

```typescript
@Injectable()
export class {Feature}PrismaRepository implements {Feature}RepositoryInterface {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async findUnique({ conditions }): Promise<{Feature} | null> {
    const record = await this.prisma.{feature}.findFirst({ where: conditions });
    if (!record) return null;
    return {Feature}.fromPrisma({ ...record, optionalField: record.optionalField ?? undefined });
  }
  // ...resto de métodos
}
```

## Controlador (`presentation/{feature}s.controller.ts`)

- `@ApiTags('{features}')` y `@Controller('{features}')`.
- Un método por caso de uso.
- Siempre decorar con `@HttpCode(HttpStatus.{STATUS})`.
- Usar `ParseUUIDPipe` para parámetros de tipo UUID.
- Decorar cada endpoint con `@ApiOperation`, `@ApiResponse` (incluyendo códigos de error).

```typescript
@ApiTags('{features}')
@Controller('{features}')
export class {Features}Controller {
  constructor(
    private readonly findAll{Features}UseCase: FindAll{Features}UseCase,
    private readonly findOne{Feature}UseCase: FindOne{Feature}UseCase,
    private readonly create{Feature}UseCase: Create{Feature}UseCase,
    private readonly update{Feature}UseCase: Update{Feature}UseCase,
    private readonly delete{Feature}UseCase: Delete{Feature}UseCase,
  ) {}

  @Get() @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List all {features}' })
  findAll() { return this.findAll{Features}UseCase.execute(); }

  @Patch(':id') @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: 404, description: '{Feature} not found' })
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: Update{Feature}Dto) { ... }

  @Delete(':id') @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseUUIDPipe()) id: string) { ... }
}
```

## Módulo (`{feature}s.module.ts`)

- Agrupar los casos de uso en una constante `const useCases = [...]`.
- Proveer el repositorio con el token string `'{Feature}RepositoryInterface'`.
- Exportar ese mismo provider para que otros módulos puedan usarlo.
- Importar siempre `PrismaModule`.
- **No usar `TypeOrmModule`** — este proyecto usa solo Prisma.

```typescript
const useCases = [
  FindAll{Features}UseCase,
  FindOne{Feature}UseCase,
  Create{Feature}UseCase,
  Update{Feature}UseCase,
  Delete{Feature}UseCase,
];

@Module({
  controllers: [{Features}Controller],
  imports: [PrismaModule],
  providers: [
    ...useCases,
    { provide: '{Feature}RepositoryInterface', useClass: {Feature}PrismaRepository },
  ],
  exports: [
    { provide: '{Feature}RepositoryInterface', useClass: {Feature}PrismaRepository },
  ],
})
export class {Features}Module {}
```

## Reglas generales

- Todos los imports de módulos propios usan paths absolutos desde `src/` (ej: `src/prisma/prisma.service`).
- Los errores de negocio siempre usan `DomainException`, nunca `HttpException` directamente en use cases.
- Los nombres de archivos usan `kebab-case`. Las clases usan `PascalCase`.
- Registrar el módulo nuevo en `src/app.module.ts`.
- Si se necesita un modelo Prisma nuevo, añadirlo en `src/prisma/models/{feature}.prisma` y ejecutar la migración.
