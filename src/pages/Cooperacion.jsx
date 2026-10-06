import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Badge, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const Cooperacion = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroRelevancia, setFiltroRelevancia] = useState('');

  const fetchAlertas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cooperacion/reporte-prueba');
      let data = response.data.alertasRelevantes || [];
      if (filtroRelevancia) {
          data = data.filter(a => a.nivelRelevancia === filtroRelevancia);
      }
      setAlertas(data);
    } catch (error) {
      console.error("Error al obtener alertas de Cooperacion", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, [filtroRelevancia]); 

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-globe text-danger me-2"></i> 
            Prototipo 3: Cooperación Internacional
          </h3>
          <p className="text-muted mb-0 small">Mapeo de convocatorias y Fondo de Recuperación Post-Terremoto</p>
        </div>
        <div className="d-flex gap-3">
          <Form.Select 
            value={filtroRelevancia} 
            onChange={(e) => setFiltroRelevancia(e.target.value)}
            disabled={loading}
            className="shadow-sm"
          >
            <option value="">Todas las oportunidades</option>
            <option value="ALTA">Solo Fondo Milagro (ALTA)</option>
            <option value="MEDIA">Otras Convocatorias (MEDIA)</option>
          </Form.Select>
          <Button className="btn-eci shadow-sm" onClick={fetchAlertas} disabled={loading} style={{ minWidth: '150px' }}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? 'Buscando...' : 'Escanear'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-3 text-muted">Consultando agencias y extrayendo imágenes disponibles...</p>
        </div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-globe-americas fs-1 text-danger opacity-50"></i>
          <p className="mt-3">No hay nuevas oportunidades detectadas.</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {alertas.map((alerta, index) => (
            <Col key={index}>
              <Card className="h-100 shadow-sm border-0 hover-card">
                {alerta.imagenUrl ? (
                  <Card.Img 
                    variant="top" 
                    src={alerta.imagenUrl} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                    alt="Imagen oportunidad"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${encodeURIComponent(alerta.titulo)}/400/200`; }}
                  />
                ) : (
                  <Card.Img 
                    variant="top" 
                    src={`https://picsum.photos/seed/${encodeURIComponent(alerta.titulo)}/400/200`} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                    alt="Imagen generada"
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg={alerta.nivelRelevancia === 'ALTA' ? 'danger' : 'info'} className="rounded-pill">
                      {alerta.nivelRelevancia === 'ALTA' ? 'URGENTE' : 'ESTÁNDAR'}
                    </Badge>
                    <small className="text-muted">{new Date(alerta.fechaPublicacion).toLocaleDateString()}</small>
                  </div>
                  <Card.Title className="fw-bold fs-6 mb-2 text-truncate" title={alerta.titulo}>{alerta.titulo}</Card.Title>
                  <Card.Text className="text-secondary small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {alerta.descripcion}
                  </Card.Text>
                  
                  <div className="mt-2 mb-3">
                    <small className="text-muted"><i className="bi bi-tag-fill text-danger me-1"></i> {alerta.palabrasClaveDetectadas}</small>
                  </div>

                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-dark small"><i className="bi bi-bank2 me-1"></i> {alerta.empresaEntidadRelacionada}</span>
                    <a href={alerta.urlOrigen} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-eci">
                      <i className="bi bi-box-arrow-up-right me-1"></i> Ver Origen
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Cooperacion;
