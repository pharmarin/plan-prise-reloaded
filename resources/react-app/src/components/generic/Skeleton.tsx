import React from "react";
import { Card, Container, Col, Row } from "react-bootstrap";

interface Size {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

type SkeletonProps = {
  children: React.ReactNode;
  header: string;
  size?: Size;
};

const Skeleton = ({ children, header, size, ...props }: SkeletonProps) => {
  size = size || {
    xl: 8,
  };
  return (
    <Container {...props}>
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

export default Skeleton;
