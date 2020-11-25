import { getIn, useFormikContext } from 'formik';
import React from 'react';

const Feedback: React.FC = ({ children }) => (
  <span className="text-red-600 text-xs">{children}</span>
);

const Input: React.FC<{
  accept?: string;
  autoComplete?: string;
  disabled?: boolean;
  multiple?: boolean;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value?: string;
  withFeedback?: boolean;
  withLoading?: boolean;
}> = ({
  accept,
  autoComplete,
  disabled,
  multiple: propsMultiple,
  name,
  placeholder,
  required,
  type,
  value: propsValue,
  withFeedback,
  withLoading,
}) => {
  const formikContext = useFormikContext(),
    errors = formikContext.errors,
    values = formikContext.values,
    touched = formikContext.touched,
    isSubmitting = formikContext.isSubmitting,
    handleBlur = formikContext.handleBlur,
    setFieldValue = formikContext.setFieldValue,
    handleChange =
      type === 'file'
        ? (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files ? e.target.files[0] : null;
            console.log('file: ', file);
            setFieldValue(name, file);
          }
        : formikContext.handleChange;

  let error = getIn(errors, name);
  let value = propsValue || getIn(values, name);
  let touch = getIn(touched, name);

  return (
    <div>
      {type === 'file' ? (
        <div className="relative">
          <input
            accept={accept}
            type={type}
            className="relative w-full h-10 m-0 opacity-0 z-10"
            name={name}
            onChange={handleChange}
            onBlur={handleBlur}
            required={required}
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
          autoComplete={autoComplete}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          disabled={disabled || withLoading ? isSubmitting : false}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value}
          name={name}
          placeholder={placeholder}
          required={required}
          type={type || 'text'}
        />
      )}
      {withFeedback && touch && error ? <Feedback>{error}</Feedback> : null}
    </div>
  );
};

export default Input;