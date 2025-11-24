import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductList from '../components/ProductList';

const SeasonalPage: React.FC = () => {
  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <div className="text-center">
            <h1 className="h2 fw-bold">Seasonal Picks</h1>
            <p className="text-muted">Perfect for this season</p>
          </div>
        </Col>
      </Row>

      <ProductList 
        featuredType="seasonal"
        key="seasonal-page"
      />
    </Container>
  );
};

export default SeasonalPage;