import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from '../components/ProductList';

const TrendingPage: React.FC = () => {
  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="h2 fw-bold">Trending Now</h1>
            <p className="text-muted">What everyone's loving</p>
          </div>
        </Col>
      </Row>

      <ProductList 
        featuredType="trending"
        key="trending-page"
      />
    </Container>
  );
};

export default TrendingPage;