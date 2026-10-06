import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/dashboard/contratacion'); // Redirigir al primer prototipo
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={4}>
          <div className="text-center mb-4">
            <img src="/logo.png" alt="Logo ECI Radar" className="img-fluid mb-2 rounded shadow-sm" style={{ maxHeight: "140px" }} />
            <p className="text-muted mt-3">Plataforma ECIRadar - Dirección de Relacionamiento</p>
          </div>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h5 className="text-center mb-4">Acceso a ECIRadar</h5>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label className="small fw-bold">Usuario Institucional</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ej: admin.escuela" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="formBasicPassword">
                  <Form.Label className="small fw-bold">Contraseña</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Tu contraseña" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="danger" type="submit" className="w-100 py-2 btn-eci" disabled={isLoading}>
                  {isLoading ? 'Autenticando...' : 'Iniciar Sesión'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="text-center mt-3 text-muted small">
            &copy; 2026 ECIRadar
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
