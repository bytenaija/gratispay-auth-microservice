/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsDefined,
  IsUUID,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsBoolean,
  IsDate,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

export function ApiPropertyCoordinate(coordinate: string) {
  return function (target: any, key: string): void {
    ApiProperty({
      description: `${coordinate} coordinate`,
      format: 'float',
    })(target, key);
    IsNumber()(target, key);
    IsDefined()(target, key);
  };
}

export function ApiPropertyWidth(target: any, key: string) {
  ApiProperty({
    format: 'float',
    description: 'Width',
  })(target, key);
  IsPositive()(target, key);
  IsNumber()(target, key);
  IsDefined()(target, key);
}

export function ApiPropertyHeight(target: any, key: string) {
  ApiProperty({
    format: 'float',
    description: 'Height',
  })(target, key);
  IsPositive()(target, key);
  IsNumber()(target, key);
  IsDefined()(target, key);
}

export function ApiPropertyPrimaryKey(target: any, key: string) {
  ApiProperty({
    description: 'Primary Key',
    format: 'uuid',
  })(target, key);
  IsDefined()(target, key);
  IsUUID()(target, key);
}

export function ApiPropertyPrimaryKeyOptional(target: any, key: string) {
  ApiPropertyOptional({
    description: 'Primary Key',
    format: 'uuid',
  })(target, key);
  IsOptional()(target, key);
  IsUUID()(target, key);
}

export function ApiPropertyPrimaryKeyReferenceTo(entityName: string) {
  return function (target: any, key: string) {
    ApiProperty({
      description: `Primary key reference to the ${entityName}. The ${entityName} has to exist.`,
      format: 'uuid',
    })(target, key);
    IsDefined()(target, key);
    IsUUID()(target, key);
  };
}

export function ApiPropertyName(entityName: string) {
  return function (target: any, key: string) {
    ApiProperty({
      description: `Name of the ${entityName}`,
    })(target, key);
    IsDefined()(target, key);
    IsString()(target, key);
    IsNotEmpty()(target, key);
  };
}

export function ApiPropertyEmbedded(type: Function) {
  return function (target: any, key: string) {
    ApiProperty()(target, key);
    IsDefined()(target, key);
    ValidateNested()(target, key);
    Type(() => type)(target, key);
  };
}

export function ApiPropertyArray(type: Function, description: string) {
  return function (target: any, key: string) {
    ApiProperty({
      description: description,
      type: [type],
    })(target, key);
    ValidateNested({ each: true })(target, key);
    IsDefined()(target, key);
    Type(() => type)(target, key);
  };
}

export function ApiPropertyArrayOptional(type: Function, description: string) {
  return function (target: any, key: string) {
    ApiPropertyOptional({
      description: description,
      type: [type],
    })(target, key);
    ValidateNested({ each: true })(target, key);
    IsOptional();
    Type(() => type)(target, key);
  };
}

export function ApiPropertyDefaultFlag(entityName: string) {
  return function (target: any, key: string) {
    ApiProperty({
      description: `Specifies which ${entityName} is selected by default`,
    })(target, key);
    IsDefined()(target, key);
    IsBoolean()(target, key);
  };
}

export function ApiPropertyUpdatedDateOptional(target: any, key: string) {
  ApiPropertyOptional({
    description: 'Date of the last update',
  })(target, key);
  IsOptional()(target, key);
  IsDate()(target, key);
  Type(() => Date)(target, key);
}

export function ApiPropertyCreatedDateOptional(target: any, key: string) {
  ApiPropertyOptional({
    description: 'Date of creation',
  })(target, key);
  IsOptional()(target, key);
  IsDate()(target, key);
  Type(() => Date)(target, key);
}
