import classNames from 'classnames';
import { FieldInputProps, useField, useFormikContext } from 'formik';
import React from 'react';
import TextareaAutoSize from 'react-textarea-autosize';
import joinClassNames from 'utility/class-names';

interface IWithFormik {
  name: string;
  withFeedback?: boolean;
  withFormik?: boolean;
  withLoading?: boolean;
}

const INPUT_CLASSES =
  'block rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50';

const Feedback: React.FC = ({ children }) => (
  <span className="text-red-600 text-xs">{children}</span>
);

const FormikContext = ({
  children,
  type,
  withFeedback,
  withLoading,
  ...props
}: {
  children: Function;
  disabled?: boolean;
  name: string;
  type?: string;
} & Omit<IWithFormik, 'withFormik'>) => {
  const [field, meta, helpers] = useField(props);
  const { isSubmitting } = useFormikContext();

  return (
    <div>
      {children({
        ...props,
        ...field,
        disabled: props.disabled || withLoading ? isSubmitting : false,
        onChange:
          type === 'file'
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

export const TextArea = ({
  className,
  style,
  withFormik,
  ...props
}: React.ComponentPropsWithoutRef<'textarea'> & IWithFormik) => {
  const TextArea = (props: React.ComponentPropsWithoutRef<'textarea'>) => (
    <TextareaAutoSize
      {...props}
      className={joinClassNames('w-full', INPUT_CLASSES, props.className)}
      style={{
        resize: 'none',
        ...props.style,
      }}
      value={props.value !== undefined ? String(props.value) : undefined}
    />
  );

  if (withFormik) {
    return (
      <FormikContext {...props}>
        {(formikProps: typeof props & FieldInputProps<any>) => (
          <TextArea {...formikProps} />
        )}
      </FormikContext>
    );
  }

  return <TextArea {...props} />;
};

export const File = ({
  className,
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
              className
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

export const Select = ({
  className,
  withFormik,
  ...props
}: React.ComponentPropsWithRef<'select'> & IWithFormik) => {
  const Select = ({
    children,
    ...props
  }: React.ComponentPropsWithRef<'select'>) => (
    <select
      {...props}
      className={joinClassNames('w-full', INPUT_CLASSES, props.className)}
    >
      {children}
    </select>
  );

  if (withFormik) {
    return (
      <FormikContext {...props}>
        {(formikProps: typeof props & FieldInputProps<any>) => (
          <Select {...formikProps} />
        )}
      </FormikContext>
    );
  }

  return <Select {...props} />;
};

const Input = ({
  className,
  withFormik,
  ...props
}: React.ComponentPropsWithRef<'input'> & IWithFormik) => {
  const Input = (props: React.ComponentPropsWithRef<'input'>) => (
    <input
      {...props}
      className={classNames(
        {
          'w-full': props.type !== 'radio' && props.type !== 'checkbox',
        },
        INPUT_CLASSES,
        props.className
      )}
    />
  );

  if (withFormik) {
    return (
      <FormikContext {...props}>
        {(formikProps: typeof props & FieldInputProps<any>) => (
          <Input {...formikProps} />
        )}
      </FormikContext>
    );
  }

  return <Input {...props} />;
};

export default Input;
