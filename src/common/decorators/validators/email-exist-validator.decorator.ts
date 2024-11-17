import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';

@ValidatorConstraint({ name: 'IsEmailExist', async: true })
@Injectable()
export class EmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async validate(email: string): Promise<boolean> {
    const result = await this.usersQueryRepository.isEmailExist(email);

    return !result;
  }
}

export function IsEmailExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailExistConstraint,
    });
  };
}
