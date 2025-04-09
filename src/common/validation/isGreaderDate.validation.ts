import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'isAfterStartDate', async: false })
  class IsAfterStartDateConstraint implements ValidatorConstraintInterface {
    validate(endDate: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
  
        if (!relatedValue || !endDate) return false;
    
        return new Date(endDate) > new Date(relatedValue);
    }
  
    defaultMessage(args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} must be greater than ${relatedPropertyName}`;
    }
  }
  
  export function IsGreaderDate(
    relatedPropertyName: string,
    validationOptions?: ValidationOptions
  ) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        constraints: [relatedPropertyName],
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: IsAfterStartDateConstraint,
      });
    };
  }
  