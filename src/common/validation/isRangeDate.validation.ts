import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isRangeDate', async: false })
export class IsRangeDateConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const [relatedPropertyName, rangeDate] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    const startDate = new Date(relatedValue);
    const endDate = new Date(value);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= rangeDate;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    return `${args.property} max is 7 days from ${relatedPropertyName}`;
  }
}

export function IsRangeDate(
    relatedPropertyName: string,
    rangeDate: number,
    validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
        constraints: [relatedPropertyName, rangeDate],
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
      validator: IsRangeDateConstraint,
    });
  };
}
