import classNames from 'classnames';
import { getIn, useFormikContext } from 'formik';
import React from 'react';

const Feedback: React.FC = ({ children }) => (
  <span className="text-red-600 text-xs">{children}</span>
);

const Input = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    withFeedback?: boolean;
    withLoading?: boolean;
  } & React.ComponentPropsWithRef<'input'>
>(
  (
    {
      className,
      disabled,
      name,
      onBlur,
      onChange,
      placeholder,
      type,
      value: propsValue,
      withFeedback,
      withLoading,
      ...props
    },
    ref
  ) => {
    const formikContext = useFormikContext();

    const isFormikInput = formikContext !== undefined;

    const handleBlur = isFormikInput ? formikContext.handleBlur : onBlur;
    const handleChange = isFormikInput
      ? type === 'file'
        ? (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files ? e.target.files[0] : null;
            console.log('file: ', file);
            formikContext.setFieldValue(name, file);
          }
        : formikContext.handleChange
      : onChange;

    const value = isFormikInput
      ? getIn(formikContext.values, name)
      : propsValue;
    const error = isFormikInput ? getIn(formikContext.errors, name) : false;
    const touch = isFormikInput ? getIn(formikContext.touched, name) : false;

    const isSubmitting = isFormikInput ? formikContext.isSubmitting : false;

    return (
      <div>
        {type === 'file' ? (
          <div className="relative">
            <input
              className={classNames(
                'relative w-full h-10 m-0 opacity-0 z-10',
                className
              )}
              name={name}
              onChange={handleChange}
              onBlur={handleBlur}
              type={type}
              {...props}
            />
            <div className="flex absolute top-0 right-0 left-0 hover:cursor-pointer">
              <label className="inline-block flex-grow h-10 p-2 text-gray-500 bg-white-900 border-gray-300 border border-l-0 rounded-l-md">
                {value ? value.name : placeholder}
              </label>
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                Ouvrir
              </span>
            </div>
          </div>
        ) : (
          <input
            className={classNames(
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50',
              className
            )}
            disabled={disabled || withLoading ? isSubmitting : false}
            name={name}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            ref={ref}
            type={type || 'text'}
            value={value}
            {...props}
          />
        )}
        {withFeedback && touch && error ? <Feedback>{error}</Feedback> : null}
      </div>
    );
  }
);

export default Input;
