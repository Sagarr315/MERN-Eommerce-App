import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from '../components/ProductList';

const SalePage: React.FC = () => {
  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="h2 fw-bold">Special Offers</h1>
            <p className="text-muted">Limited time discounts</p>
          </div>
        </Col>
      </Row>

      <ProductList 
        featuredType="sale"
        key="sale-page"
      />
    </Container>
  );
};

export default SalePage;