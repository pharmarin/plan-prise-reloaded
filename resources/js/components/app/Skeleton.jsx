import React from 'react';
import {
  Card,
  Col,
  Container,
  Row
} from 'react-bootstrap';

class Skeleton extends React.Component {
  render() {
    let { size, ...parentProps } = this.props
    size = size || { xl: 8 }
    return (
      <Container>
        <Row className="justify-content-center">
          <Col {...size}>
            <Card>
              <Card.Header className="d-flex">
                { this.props.header }
              </Card.Header>
              <Card.Body>
                { this.props.children }
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Skeleton