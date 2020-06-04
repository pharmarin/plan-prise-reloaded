import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {
  Row,
  Col,
  InputGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Form,
} from 'reactstrap';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toNumber from 'lodash/toNumber';
import { BsSearch } from 'react-icons/bs';
import ReactPlaceholder from 'react-placeholder';

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

const mapState = (state: ReduxState) => ({
  list: state.planPrise.list,
});

const connector = connect(mapState);

type SelectionProps = ConnectedProps<typeof connector>;

const Selection = (props: SelectionProps) => {
  let { list } = props;
  const [search, setSearch] = useState<number | false>(false);
  const [redirect, setRedirect] = useState<boolean>(false);
  const isLoading = list === 'loading';
  const hasLoaded = isArray(list);
  const isReady = hasLoaded && !isLoading;
  const cardSize = {
    sm: 3,
    md: 2,
  };
  let searchSuccess;

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    if (inputValue.length === 0) return setSearch(false);
    const inputNumber = toNumber(event.currentTarget.value);
    setSearch(inputNumber);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasLoaded && list.includes(search)) setRedirect(true);
  };

  if (isReady) {
    searchSuccess = list.includes(search);

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
            ready={isReady}
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
                    valid={search !== false && searchSuccess}
                    invalid={search !== false && !searchSuccess}
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
        {map(sortBy(list).reverse(), (item) => (
          <Col {...cardSize} key={item} className="mb-4">
            <Square>
              <ReactPlaceholder
                type="rect"
                showLoadingAnimation={true}
                ready={hasLoaded && !isLoading}
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
