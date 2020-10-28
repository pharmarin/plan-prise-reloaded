import Validator, { ValidationErrors } from 'validatorjs';
import { useState, useEffect } from 'react';

export default (data: any, rules: any) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  let validator = new Validator(data, rules);

  useEffect(() => {
    validator = new Validator(data, rules);
  }, [data, rules]);

  const getErrorMessageFor = (field: string) => {
    if (errors[field] !== undefined) return errors[field];
    return '';
  };

  const getErrorStatusFor = (field: string) => errors[field] !== undefined;

  return {
    errors,
    getErrorMessageFor,
  };
};
