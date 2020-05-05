/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';

const Skeleton = (props) => {
  const { children, header, ...parentProps } = props;
  let { size } = props;
  size = size || {
    xl: 8,
  };
  return (
    <Container {...parentProps}>
      <Row className="justify-content-center">
        <Col {...size}>
          <Card>
            <Card.Header className="d-flex">{header}</Card.Header>
            <Card.Body>{children}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

Skeleton.propTypes = {
  children: PropTypes.node,
  header: PropTypes.string,
  size: PropTypes.shape({
    xl: PropTypes.number,
  }),
};

export default Skeleton;
