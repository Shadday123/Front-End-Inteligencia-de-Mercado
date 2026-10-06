import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Badge, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const Empresas = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');

  const fetchAlertas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/empresas-objetivo/reporte-prueba');
      let data = response.data.alertasRelevantes || [];
      if (filtroEmpresa) {
          data = data.filter(a => a.empresaEntidadRelacionada.includes(filtroEmpresa));
      }
      setAlertas(data);
    } catch (error) {
      console.error("Error al obtener alertas de Empresas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, [filtroEmpresa]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-building text-danger me-2"></i> 
            Prototipo 2: Empresas Objetivo
          </h3>
          <p className="text-muted mb-0 small">Menciones en medios y redes empresariales</p>
        </div>
        <div className="d-flex gap-3">
          <Form.Select 
            value={filtroEmpresa} 
            onChange={(e) => setFiltroEmpresa(e.target.value)}
            disabled={loading}
            className="shadow-sm"
          >
            <option value="">Todas las empresas</option>
            <option value="Ecopetrol">Ecopetrol</option>
            <option value="Bancolombia">Bancolombia</option>
            <option value="ISA">ISA</option>
            <option value="Grupo Aval">Grupo Aval</option>
            <option value="Nutresa">Nutresa</option>
            <option value="Argos">Argos</option>
            <option value="EPM">EPM</option>
            <option value="Sura">Sura</option>
            <option value="Éxito">Éxito</option>
            <option value="Avianca">Avianca</option>
            <option value="Enel">Enel</option>
            <option value="Claro">Claro</option>
            <option value="Celsia">Celsia</option>
            <option value="Terpel">Terpel</option>
            <option value="Postobón">Postobón</option>
          </Form.Select>
          <Button className="btn-eci shadow-sm" onClick={fetchAlertas} disabled={loading} style={{ minWidth: '160px' }}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? 'Buscando...' : 'Refrescar Datos'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-3 text-muted">Leyendo fuentes de noticias y extrayendo imágenes...</p>
        </div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-journal-x fs-1 text-danger opacity-50"></i>
          <p className="mt-3">No se detectaron noticias relevantes de las empresas monitoreadas.</p>
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
                    alt="Imagen noticia"
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
                    <Badge bg="danger" className="rounded-pill">
                      <i className="bi bi-building me-1"></i> {alerta.empresaEntidadRelacionada}
                    </Badge>
                    <small className="text-muted">{new Date(alerta.fechaPublicacion).toLocaleDateString()}</small>
                  </div>
                  <Card.Title className="fw-bold fs-6 mb-3">{alerta.titulo}</Card.Title>
                  <Card.Text className="text-secondary small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {alerta.descripcion}
                  </Card.Text>
                  
                  <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                    <Badge bg="light" text="dark" className="border">
                      {alerta.fuente}
                    </Badge>
                    <a href={alerta.urlOrigen} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-eci">
                      <i className="bi bi-box-arrow-up-right me-1"></i> Leer
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

export default Empresas;
