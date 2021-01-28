import { twCascade } from '@mariusmarais/tailwind-cascade';
import classNames from 'classnames';
import { ClassValue } from 'classnames/types';

const joinClassNames = (...classes: ClassValue[]) =>
  twCascade(classNames(classes));

export default joinClassNames;
