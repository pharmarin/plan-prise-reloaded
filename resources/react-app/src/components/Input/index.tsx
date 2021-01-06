import classNames from 'classnames';
import { getIn, useFormikContext } from 'formik';
import React from 'react';
import TextareaAutoSize from 'react-textarea-autosize';
import joinClassNames from 'utility/class-names';

const INPUT_CLASSES =
  'mt-1 block rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50';

const Feedback: React.FC = ({ children }) => (
  <span className="text-red-600 text-xs">{children}</span>
);

export const Select: React.FC<
  {
    name: string;
    options: { default?: boolean; value: string; label: string }[];
    value?: string;
    withFeedback?: boolean;
    withLoading?: boolean;
  } & React.ComponentPropsWithRef<'select'>
> = ({
  className,
  disabled,
  name,
  onBlur,
  onChange,
  options,
  value: propsValue,
  withFeedback,
  withLoading,
  ...props
}) => {
  const formikContext = useFormikContext();

  const isFormikInput = formikContext !== undefined;

  const handleBlur = isFormikInput ? formikContext.handleBlur : onBlur;
  const handleChange = isFormikInput ? formikContext.handleChange : onChange;

  const value = isFormikInput ? getIn(formikContext.values, name) : propsValue;
  const error = isFormikInput ? getIn(formikContext.errors, name) : false;
  const touch = isFormikInput ? getIn(formikContext.touched, name) : false;

  const isSubmitting = isFormikInput ? formikContext.isSubmitting : false;

  return (
    <React.Fragment>
      <select
        className={joinClassNames('w-full', INPUT_CLASSES, className)}
        disabled={disabled || withLoading ? isSubmitting : false}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {withFeedback && touch && error ? <Feedback>{error}</Feedback> : null}
    </React.Fragment>
  );
};

export const Textarea: React.FC<
  {
    autoSize?: boolean;
    name: string;
    value?: string;
    withFeedback?: boolean;
    withLoading?: boolean;
  } & React.ComponentPropsWithRef<'textarea'>
> = ({
  autoSize,
  className,
  children,
  disabled,
  name,
  onBlur,
  onChange,
  ref,
  value: propsValue,
  withFeedback,
  withLoading,
  ...props
}) => {
  const formikContext = useFormikContext();

  const isFormikInput = formikContext !== undefined;

  const handleBlur = isFormikInput ? formikContext.handleBlur : onBlur;
  const handleChange = isFormikInput ? formikContext.handleChange : onChange;

  const value = isFormikInput ? getIn(formikContext.values, name) : propsValue;
  const error = isFormikInput ? getIn(formikContext.errors, name) : false;
  const touch = isFormikInput ? getIn(formikContext.touched, name) : false;

  const isSubmitting = isFormikInput ? formikContext.isSubmitting : false;

  const componentProps = {
    ...props,
    className: joinClassNames('w-full', INPUT_CLASSES, className),
    disabled: disabled || withLoading ? isSubmitting : false,
    name,
    onBlur: handleBlur,
    onChange: handleChange,
    style: undefined,
    value,
  };

  return (
    <React.Fragment>
      {autoSize ? (
        <TextareaAutoSize inputRef={ref || undefined} {...componentProps} />
      ) : (
        <textarea {...componentProps} />
      )}
      {withFeedback && touch && error ? <Feedback>{error}</Feedback> : null}
    </React.Fragment>
  );
};

const Input = React.forwardRef<
  HTMLInputElement,
  {
    name: string;
    options?: { value: string; label: string }[];
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
      options,
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
      <React.Fragment>
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
              {
                'w-full': type !== 'radio' && type !== 'checkbox',
              },
              INPUT_CLASSES,
              className
            )}
            disabled={disabled || withLoading ? isSubmitting : false}
            name={name}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={placeholder}
            ref={ref}
            type={type || 'text'}
            value={isFormikInput ? value || '' : value} // Si l'input est controllé par Formik, la valeur ne doit jamais être undefined
            {...props}
          />
        )}
        {withFeedback && touch && error ? <Feedback>{error}</Feedback> : null}
      </React.Fragment>
    );
  }
);

export default Input;
