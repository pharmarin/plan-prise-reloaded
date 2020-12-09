import classNames from 'classnames';
import { uniqueId } from 'lodash-es';
import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import ReactPlaceholder from 'react-placeholder';
import { connect, ConnectedProps } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {
  Col,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';
import { selectListState } from 'store/plan-prise/selectors/list';

const Square: React.FC = ({ children }) => {
  return (
    <div className={`square rounded shadow-sm d-flex p-2`}>
      <div className="d-block w-100">{children}</div>
    </div>
  );
};

const TextFit: React.FC<{ text: string }> = ({ text }) => {
  const length = text.length;
  const fontSize = 100 - 14 * length;
  return (
    <svg
      className={classNames('svg-link', {
        'svg-link-success': text === 'new',
      })}
      viewBox={`0 0 100 100`}
    >
      {text === 'new' ? (
        [
          <text
            key="+"
            x="50"
            y="30"
            style={{
              fontSize: 80,
              dominantBaseline: 'central',
              textAnchor: 'middle',
            }}
          >
            +
          </text>,
          <text
            key="new"
            x="50"
            y="80"
            style={{
              fontSize: 20,
              dominantBaseline: 'central',
              textAnchor: 'middle',
            }}
          >
            Nouveau
          </text>,
        ]
      ) : (
        <text
          key={text}
          x="50"
          y="50"
          style={{
            fontSize: fontSize,
            dominantBaseline: 'central',
            textAnchor: 'middle',
          }}
        >
          {text}
        </text>
      )}
    </svg>
  );
};

const mapState = (state: Redux.State) => ({
  status: selectListState(state),
  list: state.planPrise.list.data,
});

const connector = connect(mapState);

type SelectionProps = ConnectedProps<typeof connector>;

const Selection = ({ list, status }: SelectionProps) => {
  const [search, setSearch] = useState<string | undefined>(undefined);

  const [redirect, setRedirect] = useState<boolean>(false);

  const cardSize = {
    sm: 3,
    md: 2,
  };

  let searchSuccess;

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    if (inputValue.length === 0) return setSearch(undefined);
    const inputNumber = event.currentTarget.value;
    setSearch(inputNumber);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!status.isLoaded || !search) return;
    if (Array.isArray(list) && list.includes(search)) setRedirect(true);
  };

  if (status.isLoaded && search) {
    searchSuccess = Array.isArray(list) && list.includes(search);

    if (redirect && searchSuccess)
      return <Redirect to={`/plan-prise/${search}`} />;
  }

  return (
    <React.Fragment>
      <Row>
        <Col xs={12} md={{ size: 8, offset: 2 }} className="mb-4">
          <ReactPlaceholder
            type="textRow"
            showLoadingAnimation={true}
            ready={status.isLoaded}
          >
            <Form onSubmit={handleSearchSubmit}>
              <FormGroup
                className={classNames('form-control-alternative', {
                  'has-success': search && searchSuccess,
                  'has-danger': search && !searchSuccess,
                })}
              >
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="pr-0">
                      Accès rapide au plan de prise #
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    autoFocus
                    className={classNames('form-control-alternative', {
                      'text-success': search && searchSuccess,
                      'text-danger': search && !searchSuccess,
                    })}
                    onChange={handleSearch}
                    type="number"
                    valid={search !== undefined && searchSuccess}
                    invalid={search !== undefined && !searchSuccess}
                    value={search || ''}
                  />
                  {search === null && (
                    <InputGroupAddon addonType="append">
                      <InputGroupText>
                        <BsSearch />
                      </InputGroupText>
                    </InputGroupAddon>
                  )}
                </InputGroup>
              </FormGroup>
            </Form>
          </ReactPlaceholder>
        </Col>
      </Row>
      <Row>
        <Col {...cardSize} className="mb-4">
          <Square>
            <Link className="my-auto" to="/plan-prise/nouveau">
              <TextFit text="new" />
            </Link>
          </Square>
        </Col>
        {(Array.isArray(list)
          ? list
          : Array.from({ length: 5 }, () => uniqueId())
        ).map((item) => (
          <Col {...cardSize} key={item} className="mb-4">
            <Square>
              <ReactPlaceholder
                type="rect"
                showLoadingAnimation={true}
                ready={status.isLoaded}
                className="m-0"
              >
                <Link key={item} to={`/plan-prise/${item}`}>
                  <TextFit text={`#${item}`} />
                </Link>
              </ReactPlaceholder>
            </Square>
          </Col>
        ))}
      </Row>
    </React.Fragment>
  );
};

export default connector(Selection);