import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Badge, Button, Form, Modal } from 'react-bootstrap';
import api from '../services/api';

const EMPRESAS_ESCUELA_TE_VISITA = [
  { value: 'Coca-Cola FEMSA', label: 'Coca-Cola FEMSA (Tocancipá – Vda. Canavita)' },
  { value: 'Bavaria – AB InBev', label: 'Bavaria – AB InBev (Tocancipá – Vda. Canavita)' },
  { value: 'Belcorp', label: 'Belcorp – Ésika, L\'BEL, Cyzone (Tocancipá – Vda. Canavita)' },
  { value: 'Quala', label: 'Quala (Tocancipá – Vda. Tibitó)' },
  { value: 'Aceros Diaco – Gerdau', label: 'Aceros Diaco – Gerdau (Tocancipá – Vda. Tibitó)' },
  { value: 'Alpina Productos Alimenticios', label: 'Alpina Productos Alimenticios (Sopó, Cundinamarca)' },
  { value: 'Corona Industrial – Prestigio II', label: 'Corona Industrial – Prestigio II (Sopó, Cundinamarca)' },
  { value: 'Sika Colombia', label: 'Sika Colombia (Tocancipá – Vda. Canavita)' },
  { value: 'Linde Colombia', label: 'Linde Colombia (Tocancipá – Vda. Canavita)' },
  { value: 'Alquería', label: 'Alquería (Cajicá, Cundinamarca)' },
];

const GRANDES_EMPRESAS_NACIONALES = [
  'Ecopetrol', 'Bancolombia', 'ISA', 'Grupo Aval', 'Nutresa',
  'Argos', 'EPM', 'Sura', 'Grupo Éxito', 'Avianca',
  'Enel Colombia', 'Claro Colombia', 'Celsia', 'Terpel', 'Postobón'
];

const Empresas = () => {
  const [alertasOriginales, setAlertasOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroCategoria, setFiltroCategoria] = useState('LA_ESCUELA_TE_VISITA');
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);

  const fetchAlertas = async (empParam = filtroEmpresa, catParam = filtroCategoria) => {
    setLoading(true);
    try {
      const response = await api.get('/empresas-objetivo/reporte-prueba', {
        params: {
          empresa: empParam || undefined,
          categoria: catParam || undefined,
        },
      });
      const data = response.data.alertasRelevantes || [];
      setAlertasOriginales(data);
    } catch (error) {
      console.error("Error al obtener alertas de Empresas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas(filtroEmpresa, filtroCategoria);
  }, [filtroEmpresa, filtroCategoria]);

  const esDeEscuelaTeVisita = (alerta) => {
    if ((alerta.tipoInformacion || '').startsWith('LA_ESCUELA_TE_VISITA')) return true;
    const emp = (alerta.empresaEntidadRelacionada || '').toLowerCase();
    return EMPRESAS_ESCUELA_TE_VISITA.some(e => emp.includes(e.value.toLowerCase()));
  };

  const alertasFiltradas = alertasOriginales.filter((alerta) => {
    if (filtroCategoria === 'LA_ESCUELA_TE_VISITA' && !esDeEscuelaTeVisita(alerta)) {
      return false;
    }
    if (filtroCategoria === 'GRANDES_NACIONALES' && esDeEscuelaTeVisita(alerta)) {
      return false;
    }
    if (filtroEmpresa && !(alerta.empresaEntidadRelacionada || '').toLowerCase().includes(filtroEmpresa.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-building text-danger me-2"></i> 
            Empresas Objetivo
          </h3>
          <p className="text-muted mb-0 small">
            Proyecto <strong>"La Escuela Te Visita"</strong> y Grandes Empresas Nacionales
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Form.Select
            value={filtroCategoria}
            onChange={(e) => {
              setFiltroCategoria(e.target.value);
              setFiltroEmpresa('');
            }}
            disabled={loading}
            className="shadow-sm"
            style={{ width: 'auto', minWidth: '250px' }}
          >
            <option value="LA_ESCUELA_TE_VISITA">Proyecto: La Escuela Te Visita</option>
            <option value="GRANDES_NACIONALES">Grandes Empresas Nacionales</option>
          </Form.Select>

          <Form.Select 
            value={filtroEmpresa} 
            onChange={(e) => setFiltroEmpresa(e.target.value)}
            disabled={loading}
            className="shadow-sm"
            style={{ width: 'auto', minWidth: '260px' }}
          >
            <option value="">Todas las empresas de la categoría</option>
            {filtroCategoria === 'LA_ESCUELA_TE_VISITA' && (
              <optgroup label="La Escuela Te Visita">
                {EMPRESAS_ESCUELA_TE_VISITA.map((emp) => (
                  <option key={emp.value} value={emp.value}>{emp.label}</option>
                ))}
              </optgroup>
            )}
            {filtroCategoria === 'GRANDES_NACIONALES' && (
              <optgroup label="Grandes Empresas Nacionales">
                {GRANDES_EMPRESAS_NACIONALES.map((emp) => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </optgroup>
            )}
          </Form.Select>

          <Button className="btn-eci shadow-sm" onClick={() => fetchAlertas(filtroEmpresa, filtroCategoria)} disabled={loading} style={{ minWidth: '150px' }}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? 'Buscando...' : 'Refrescar Datos'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
          <p className="mt-3 text-muted">Consultando noticias recientes...</p>
        </div>
      ) : alertasFiltradas.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-journal-x fs-1 text-danger opacity-50"></i>
          <p className="mt-3">No se detectaron noticias recientes para el filtro seleccionado.</p>
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {alertasFiltradas.map((alerta, index) => {
            const esVisita = esDeEscuelaTeVisita(alerta);
            return (
              <Col key={alerta.urlOrigen || alerta.titulo || index}>
                <Card className="h-100 shadow-sm border-0 hover-card">
                  {alerta.imagenUrl ? (
                    <Card.Img 
                      variant="top" 
                      src={alerta.imagenUrl} 
                      style={{ height: '190px', objectFit: 'cover' }} 
                      alt="Imagen noticia"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${encodeURIComponent(alerta.titulo)}/400/200`; }}
                    />
                  ) : (
                    <Card.Img 
                      variant="top" 
                      src={`https://picsum.photos/seed/${encodeURIComponent(alerta.titulo)}/400/200`} 
                      style={{ height: '190px', objectFit: 'cover' }} 
                      alt="Imagen noticia"
                    />
                  )}
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2 gap-1">
                      <Badge bg={esVisita ? 'danger' : 'dark'} className="rounded-pill text-wrap text-start">
                        <i className={`bi ${esVisita ? 'bi-geo-alt-fill' : 'bi-building'} me-1`}></i>
                        {alerta.empresaEntidadRelacionada}
                      </Badge>
                      <small className="text-muted text-nowrap">
                        {alerta.fechaPublicacion ? new Date(alerta.fechaPublicacion).toLocaleDateString() : ''}
                      </small>
                    </div>
                    {esVisita && (
                      <div className="mb-2 d-flex flex-wrap gap-1">
                        <Badge bg="warning" text="dark" className="fw-semibold">
                          <i className="bi bi-mortarboard-fill me-1"></i> La Escuela Te Visita
                        </Badge>
                      </div>
                    )}
                    <Card.Title className="fw-bold fs-6 mb-2">{alerta.titulo}</Card.Title>
                    <Card.Text className="text-secondary small flex-grow-1" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {alerta.descripcion}
                    </Card.Text>
                    
                    <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center gap-2">
                      <Badge bg="light" text="dark" className="border text-truncate" style={{ maxWidth: '45%' }}>
                        {alerta.fuente}
                      </Badge>
                      <div className="d-flex gap-1">
                        <Button
                          variant="light"
                          size="sm"
                          className="border fw-semibold text-danger"
                          onClick={() => setNoticiaSeleccionada(alerta)}
                        >
                          <i className="bi bi-book me-1"></i> Ver Contenido
                        </Button>
                        <a href={alerta.urlOrigen} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-eci" title="Ir a la fuente original">
                          <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Modal para ver el detalle de la noticia dentro de ECIRadar */}
      <Modal show={Boolean(noticiaSeleccionada)} onHide={() => setNoticiaSeleccionada(null)} size="lg" centered scrollable>
        {noticiaSeleccionada && (
          <>
            <Modal.Header closeButton>
              <div>
                <Badge bg="danger" className="mb-1 me-2">{noticiaSeleccionada.empresaEntidadRelacionada}</Badge>
                <Badge bg="light" text="dark" className="border">{noticiaSeleccionada.fuente}</Badge>
                <h5 className="fw-bold text-dark mt-2 mb-0">{noticiaSeleccionada.titulo}</h5>
              </div>
            </Modal.Header>
            <Modal.Body>
              {noticiaSeleccionada.imagenUrl && (
                <img
                  src={noticiaSeleccionada.imagenUrl}
                  alt="Imagen de la noticia"
                  className="img-fluid rounded mb-3 w-100"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div className="mb-3">
                <Badge bg="light" text="dark" className="border">
                  <i className="bi bi-info-circle text-danger me-1"></i> {noticiaSeleccionada.palabrasClaveDetectadas}
                </Badge>
              </div>
              <div className="text-dark" style={{ whiteSpace: 'pre-line', lineHeight: '1.7', fontSize: '0.98rem' }}>
                {noticiaSeleccionada.descripcion}
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              <small className="text-muted">
                Fecha: {noticiaSeleccionada.fechaPublicacion ? new Date(noticiaSeleccionada.fechaPublicacion).toLocaleDateString() : 'Reciente'}
              </small>
              <div className="d-flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setNoticiaSeleccionada(null)}>
                  Cerrar
                </Button>
                <a href={noticiaSeleccionada.urlOrigen} target="_blank" rel="noreferrer" className="btn btn-sm btn-eci">
                  <i className="bi bi-box-arrow-up-right me-1"></i> Abrir artículo original en {noticiaSeleccionada.fuente}
                </a>
              </div>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Empresas;
