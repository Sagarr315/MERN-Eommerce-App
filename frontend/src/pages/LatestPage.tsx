import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from '../components/ProductList';

const LatestPage: React.FC = () => {
  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="h2 fw-bold">Latest Collection</h1>
            <p className="text-muted">Fresh from our designers</p>
          </div>
        </Col>
      </Row>

      <ProductList 
        featuredType="latest"
        key="latest-page"
      />
    </Container>
  );
};

export default LatestPage;