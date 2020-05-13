/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { Button, Form, FormCheck } from "react-bootstrap";
import autosize from "autosize";
import get from "lodash/get";
import isObject from "lodash/isObject";
import map from "lodash/map";
import isArray from "lodash/isArray";

import { doUpdateLine } from "store/plan-prise/actions";

class PPInput extends React.Component {
  componentDidMount() {
    autosize(this.textarea);
  }

  render() {
    const { input, lineId, updateLine, value } = this.props;
    const stringValue = isObject(value) ? value.value : value;
    const help = get(value, "help", null);

    return (
      <React.Fragment>
        <Form.Text
          className="text-muted font-italic"
          style={{ fontSize: ".8em" }}
        >
          {help}
        </Form.Text>
        <Form.Control
          ref={(i) => {
            this.textarea = i;
          }}
          as="textarea"
          className="flex-fill"
          disabled={input.readOnly}
          rows={1}
          value={stringValue || ""}
          onChange={(event) =>
            updateLine(
              lineId,
              {
                type: "value",
                value: event.target.value,
              },
              {
                parent: get(value, "addedData", false)
                  ? `custom_${input.id}`
                  : input.id,
                child: get(value, "addedData", false)
                  ? `custom_${input.id}`
                  : input.display,
                id: get(this.props, "value.id", null),
                readOnly: input.readOnly,
                multiple: input.multiple,
              }
            )
          }
        />
      </React.Fragment>
    );
  }
}

PPInput.propTypes = {
  input: PropTypes.shape({
    display: PropTypes.string,
    id: PropTypes.string,
    multiple: PropTypes.bool,
    readOnly: PropTypes.bool,
  }),
  lineId: PropTypes.number,
  updateLine: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      value: PropTypes.any,
    }),
  ]),
};

const PPInputBase = (props) => {
  const { children, input } = props;
  return (
    <div>
      <p
        className="text-muted mb-0 ml-1"
        style={{
          fontSize: ".8em",
        }}
      >
        {input.label}
      </p>
      {children}
    </div>
  );
};

PPInputBase.propTypes = {
  children: PropTypes.element,
  input: PropTypes.shape({
    label: PropTypes.string,
  }),
};

const PPInputGroup = (props) => {
  const { addCustomItem, updateLine, values, ...otherProps } = props;
  const { input, lineId } = otherProps;
  const inputValue = values[input.id];

  if (isArray(inputValue)) {
    return (
      <PPInputBase input={input}>
        {[
          ...map(inputValue, (inputVal) => (
            <Form.Group key={inputVal}>
              <Form.Check className="flex-fill mb-2">
                <FormCheck.Input
                  checked={inputVal.checked}
                  style={
                    inputVal.help
                      ? {
                          marginTop: "1.8em",
                        }
                      : null
                  }
                  type={input.multiple ? "checkbox" : "radio"}
                  onChange={(event) =>
                    updateLine(
                      lineId,
                      {
                        type: input.multiple ? "check" : "choose",
                        value: input.multiple
                          ? event.target.checked
                          : inputVal.choose,
                      },
                      {
                        parent: inputVal.addedData
                          ? `custom_${input.id}`
                          : input.id,
                        id: inputVal.id,
                        multiple: input.multiple,
                      }
                    )
                  }
                />
                <FormCheck.Label className="d-flex flex-column">
                  {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                  <PPInput value={inputVal} {...otherProps} />
                </FormCheck.Label>
              </Form.Check>
            </Form.Group>
          )),
          input.multiple && (
            <Button
              key={-1}
              variant="link"
              onClick={() => addCustomItem(null, input.id)}
            >
              Nouvelle ligne
            </Button>
          ),
        ]}
      </PPInputBase>
    );
  }

  return (
    <PPInputBase input={input}>
      <Form.Group>
        <PPInput value={inputValue} {...otherProps} />
      </Form.Group>
    </PPInputBase>
  );
};

PPInputGroup.propTypes = {
  addCustomItem: PropTypes.func,
  updateLine: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.any,
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateLine: (lineId, action, input) =>
      dispatch(doUpdateLine(lineId, action, input)),
  };
};

export default connect(null, mapDispatchToProps)(PPInputGroup);
