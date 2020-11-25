import React from 'react';

const FormText: React.FC = ({ children }) => (
  <div className="mt-1 text-xs text-gray-500">{children}</div>
);

const Form: React.FC<{
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
}> & {
  Text: typeof FormText;
} = ({ children, onSubmit }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

Form.Text = FormText;

export default Form;
