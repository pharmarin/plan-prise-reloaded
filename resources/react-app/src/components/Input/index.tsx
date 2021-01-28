import classNames from 'classnames';
import { FieldInputProps, useField, useFormikContext } from 'formik';
import { uniqueId } from 'lodash-es';
import React from 'react';
import TextareaAutoSize from 'react-textarea-autosize';
import joinClassNames from 'tools/class-names';

interface IWithFormik {
  name: string;
  withFeedback?: boolean;
  withFormik?: boolean;
  withLoading?: boolean;
}

const inputClasses = (props: any) => [
  'block rounded-md border-gray-300 shadow-sm',
  'checked:bg-green-700',
  {
    'focus:border-green-300 focus:ring-2 focus:ring-green-200 focus:ring-opacity-50': !props.readOnly,
    'bg-gray-50 focus:border-gray-300 focus:ring-0 cursor-not-allowed':
      props.readOnly,
  },
];

const Feedback: React.FC = ({ children }) => (
  <span className="text-red-600 text-xs">{children}</span>
);

const FormikContext = ({
  children,
  withFeedback,
  withLoading,
  ...props
}: {
  children: Function;
  disabled?: boolean;
  name: string;
  type?: string;
} & Omit<IWithFormik, 'withFormik'>) => {
  const [field, meta, helpers] = useField({
    ...props,
    type: props.type === 'toggle' ? 'checkbox' : props.type,
  });
  const { isSubmitting } = useFormikContext();

  return (
    <div>
      {children({
        ...props,
        ...field,
        disabled: props.disabled || withLoading ? isSubmitting : false,
        onChange:
          props.type === 'file'
            ? (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files ? e.target.files[0] : null;
                console.log('file: ', file);
                helpers.setValue(file);
              }
            : field.onChange,
      })}
      {withFeedback && meta.touched && meta.error && (
        <Feedback>{meta.error}</Feedback>
      )}
    </div>
  );
};

const TextAreaComponent = (
  props: React.ComponentPropsWithoutRef<'textarea'>
) => (
  <TextareaAutoSize
    {...props}
    className={joinClassNames('w-full', inputClasses(props), props.className)}
    style={{
      resize: 'none',
      ...props.style,
    }}
    value={props.value !== undefined ? String(props.value) : undefined}
  />
);

export const TextArea = ({
  style,
  withFormik,
  ...props
}: React.ComponentPropsWithoutRef<'textarea'> & IWithFormik) => {
  if (withFormik) {
    return (
      <FormikContext {...props}>
        {(formikProps: typeof props & FieldInputProps<any>) => (
          <TextAreaComponent {...formikProps} />
        )}
      </FormikContext>
    );
  }

  return <TextAreaComponent {...props} />;
};

export const File = ({
  withFormik,
  ...props
}: React.ComponentPropsWithoutRef<'input'> & IWithFormik) => {
  if (!withFormik)
    throw new Error('File input without formik is not yet coded');
  return (
    <FormikContext type="file" {...props}>
      {(formikProps: typeof props & FieldInputProps<any>) => (
        <div className="relative">
          <input
            className={classNames(
              'relative w-full h-10 m-0 opacity-0 z-10',
              props.className
            )}
            type="file"
            {...formikProps}
          />
          <div className="flex absolute top-0 right-0 left-0 hover:cursor-pointer">
            <label className="inline-block flex-grow h-10 p-2 text-gray-500 bg-white-900 border-gray-300 border border-l-0 rounded-l-md">
              {formikProps.value
                ? //value.name
                  undefined
                : formikProps.placeholder}
            </label>
            <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              Ouvrir
            </span>
          </div>
        </div>
      )}
    </FormikContext>
  );
};

const SelectComponent = ({
  children,
  ...props
}: React.ComponentPropsWithRef<'select'>) => (
  <select
    {...props}
    className={joinClassNames('w-full', inputClasses(props), props.className)}
  >
    {children}
  </select>
);

export const Select = ({
  withFormik,
  ...props
}: React.ComponentPropsWithRef<'select'> & IWithFormik) => {
  if (withFormik) {
    return (
      <FormikContext {...props}>
        {(formikProps: typeof props & FieldInputProps<any>) => (
          <SelectComponent {...formikProps} />
        )}
      </FormikContext>
    );
  }

  return <SelectComponent {...props} />;
};

const ToggleComponent = ({
  toggleSize,
  ...props
}: React.ComponentPropsWithRef<'input'> & { toggleSize?: 'sm' }) => {
  const uid = uniqueId('toggle_');

  return (
    <label htmlFor={uid} className="toggle relative">
      <input id={uid} {...props} type="checkbox" className="hidden" />
      <div
        className={joinClassNames([
          'toggle-path',
          'bg-gray-200  shadow-inner',
          'w-9 h-5',
          'rounded-full',
          'transition duration-300 ease-in-out',
          { 'w-7 h-4': toggleSize === 'sm' },
          { 'bg-gray-400': props.checked },
        ])}
      ></div>
      <div
        className={joinClassNames([
          'toggle-circle',
          'absolute top-0.8 left-1',
          'w-3.5 h-3.5',
          'bg-white shadow',
          'rounded-full',
          'transition-all duration-300 ease-in-out',
          { 'w-2.5 h-2.5': toggleSize === 'sm' },
          { 'transform translate-x-full': props.checked },
        ])}
      ></div>
    </label>
  );
};

const InputComponent = ({
  toggleSize,
  ...props
}: React.ComponentPropsWithRef<'input'> & { toggleSize?: 'sm' }) => {
  if (props.type === 'toggle') {
    return <ToggleComponent toggleSize={toggleSize} {...props} />;
  }

  return (
    <input
      {...props}
      className={classNames(
        {
          'w-full': props.type !== 'radio' && props.type !== 'checkbox',
        },
        inputClasses(props),
        props.className
      )}
      key={props.name}
    />
  );
};

const Input = ({
  withFormik,
  ...props
}: React.ComponentPropsWithRef<'input'> &
  IWithFormik & { toggleSize?: 'sm' }) => {
  if (withFormik) {
    return (
      <FormikContext {...props}>
        {(formikProps: typeof props & FieldInputProps<any>) => (
          <InputComponent {...formikProps} />
        )}
      </FormikContext>
    );
  }

  return <InputComponent {...props} />;
};

export default Input;
