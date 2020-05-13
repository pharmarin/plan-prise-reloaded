/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';

import TextareaAutosize from 'react-autosize-textarea';
import keys from 'lodash/keys';
import map from 'lodash/map';

const GenericInput = (props) => {
  const defaultDivClassName = ' flex-fill px-0 pb-1';
  const defaultInputClassName = 'form-control mr-1';
  const { className, options, type } = props;

  if (type === 'select') {
    return (
      <div className={[className + defaultDivClassName]}>
        <select {...props} className={defaultInputClassName}>
          {map(keys(options), (value) => (
            <option key={value} value={value}>
              {options[value]}
            </option>
          ))}
        </select>
      </div>
    );
  }
  if (type === 'textarea') {
    return (
      <div className={[className + defaultDivClassName]}>
        <TextareaAutosize
          {...props}
          className={defaultInputClassName}
        />
      </div>
    );
  }
  return (
    <div className={[className + defaultDivClassName]}>
      <input {...props} className={defaultInputClassName} />
    </div>
  );
};

GenericInput.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  options: PropTypes.object,
  type: PropTypes.string,
};

export default GenericInput;
