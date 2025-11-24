import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from '../components/ProductList';

const NewArrivalPage: React.FC = () => {
  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="h2 fw-bold">New Arrivals</h1>
            <p className="text-muted">Just launched products</p>
          </div>
        </Col>
      </Row>

      <ProductList 
        featuredType="new_arrival"
        key="new-arrival-page"
      />
    </Container>
  );
};

export default NewArrivalPage;