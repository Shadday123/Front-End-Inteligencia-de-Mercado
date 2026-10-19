import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Badge, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const AREAS_FUERTES_ECI = [
  { value: 'Civil, Infraestructura e Interventoría', label: 'Ingeniería Civil, Infraestructura e Interventoría' },
  { value: 'Sistemas, IA, Datos y Ciberseguridad', label: 'Ingeniería de Sistemas, IA, Datos y Ciberseguridad' },
  { value: 'Eléctrica, Electrónica y Energía', label: 'Ingeniería Eléctrica, Electrónica y Energía' },
  { value: 'Industrial, Ambiental, Hidráulica y Gerencia', label: 'Ingeniería Industrial, Ambiental, Hidráulica y Gerencia' },
  { value: 'Educación Continua y Capacitación', label: 'Educación Continua, Diplomados y Capacitación' },
];

const Contratacion = () => {
  const [alertasOriginales, setAlertasOriginales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filtroRelevancia, setFiltroRelevancia] = useState('');
  const [filtroAreaEci, setFiltroAreaEci] = useState('');
  const [soloConFechaCierre, setSoloConFechaCierre] = useState(false);

  const fetchAlertas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contratacion-publica/reporte');
      const data = response.data.contratos || [];
      setAlertasOriginales(data);
    } catch (error) {
      console.error("Error al obtener alertas de SECOP", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, []);

  const toggleRow = (id) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  const alertasFiltradas = alertasOriginales.filter((alerta) => {
    if (alerta.fechaCierre) {
      const cierre = new Date(alerta.fechaCierre);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (cierre < hoy) {
        return false; // No mostrar plazos vencidos
      }
    }
    if (filtroRelevancia && alerta.nivelRelevancia !== filtroRelevancia) {
      return false;
    }
    if (filtroAreaEci && !(alerta.palabrasClaveDetectadas || '').includes(filtroAreaEci)) {
      return false;
    }
    if (soloConFechaCierre && !alerta.fechaCierre) {
      return false;
    }
    return true;
  });

  const renderFechaCierre = (alerta) => {
    if (!alerta.fechaCierre) {
      return (
        <div>
          <Badge bg="secondary" className="fw-normal mb-1">
            <i className="bi bi-file-earmark-text me-1"></i> Según pliego en SECOP
          </Badge>
          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
            Apertura: {alerta.fechaPublicacion ? new Date(alerta.fechaPublicacion).toLocaleDateString() : 'N/D'}
          </div>
        </div>
      );
    }

    const cierre = new Date(alerta.fechaCierre);
    const hoy = new Date();
    const diffDias = Math.ceil((cierre - hoy) / (1000 * 60 * 60 * 24));

    let badgeColor = 'success';
    let estadoTexto = `${diffDias} días restantes`;
    if (diffDias < 0) {
      badgeColor = 'secondary';
      estadoTexto = 'Plazo vencido';
    } else if (diffDias <= 5) {
      badgeColor = 'danger';
      estadoTexto = diffDias === 0 ? '¡Cierra hoy!' : `¡Cierra en ${diffDias} días!`;
    } else if (diffDias <= 15) {
      badgeColor = 'warning';
      estadoTexto = `Cierra en ${diffDias} días`;
    }

    return (
      <div>
        <div className="fw-bold text-dark">
          <i className="bi bi-calendar-event text-danger me-1"></i>
          {cierre.toLocaleDateString()}
        </div>
        <Badge bg={badgeColor} text={badgeColor === 'warning' ? 'dark' : 'light'} className="mt-1">
          {estadoTexto}
        </Badge>
        <div className="text-muted mt-1" style={{ fontSize: '0.72rem' }}>
          Publicado: {alerta.fechaPublicacion ? new Date(alerta.fechaPublicacion).toLocaleDateString() : 'N/D'}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3 gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-bank text-danger me-2"></i> 
            Prototipo 1: SECOP II
          </h3>
          <p className="text-muted mb-0 small">
            Licitaciones priorizadas según los fuertes académicos y de consultoría de la Escuela Colombiana de Ingeniería Julio Garavito
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Form.Select
            value={filtroAreaEci}
            onChange={(e) => setFiltroAreaEci(e.target.value)}
            disabled={loading}
            className="shadow-sm"
            style={{ width: 'auto', minWidth: '250px' }}
          >
            <option value="">Todos los fuertes de la Escuela</option>
            {AREAS_FUERTES_ECI.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </Form.Select>

          <Form.Select 
            value={filtroRelevancia} 
            onChange={(e) => setFiltroRelevancia(e.target.value)}
            disabled={loading}
            className="shadow-sm"
            style={{ width: 'auto', minWidth: '210px' }}
          >
            <option value="">Toda Relevancia ECI</option>
            <option value="ALTA">Alta Afinidad ECI (Prioritarias)</option>
            <option value="MEDIA">Afinidad Media</option>
          </Form.Select>

          <Form.Check
            type="switch"
            id="switch-fecha-cierre"
            label="Solo con fecha cierre"
            checked={soloConFechaCierre}
            onChange={(e) => setSoloConFechaCierre(e.target.checked)}
            className="ms-2 me-2 small fw-semibold text-secondary"
          />

          <Button className="btn-eci shadow-sm" onClick={fetchAlertas} disabled={loading} style={{ minWidth: '150px' }}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? 'Consultando...' : 'Refrescar Datos'}
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="danger" />
              <p className="mt-3 text-muted">Consultando la API de Socrata (SECOP II) y evaluando afinidad con la Escuela...</p>
            </div>
          ) : alertasFiltradas.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 text-danger opacity-50"></i>
              <p className="mt-3">No se encontraron licitaciones con los filtros seleccionados.</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle table-compact mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Entidad</th>
                  <th>Licitación / Línea Fuerte ECI</th>
                  <th>Afinidad ECI</th>
                  <th>Fecha Límite (Cierre)</th>
                </tr>
              </thead>
              <tbody>
                {alertasFiltradas.map((alerta, index) => {
                  const partesEtiqueta = (alerta.palabrasClaveDetectadas || '').split(' • Claves: ');
                  const areasFuerte = partesEtiqueta[0] || 'Ingeniería y Consultoría';
                  const palabrasClaves = partesEtiqueta[1] || '';

                  return (
                    <React.Fragment key={index}>
                      <tr onClick={() => toggleRow(index)} className="row-expandable" style={{ cursor: 'pointer' }}>
                        <td className="text-center text-muted">
                          <i className={`bi bi-chevron-${expandedRow === index ? 'up' : 'down'}`}></i>
                        </td>
                        <td className="fw-semibold text-dark" style={{ maxWidth: '230px' }}>
                          {alerta.empresaEntidadRelacionada}
                          <div className="text-muted fw-normal small">{alerta.tipoInformacion}</div>
                        </td>
                        <td>
                          <div className="fw-semibold text-dark mb-1" style={{ maxWidth: '460px' }}>
                            {alerta.titulo}
                          </div>
                          <Badge bg="light" text="danger" className="border border-danger-subtle fw-normal">
                            <i className="bi bi-mortarboard-fill me-1"></i> {areasFuerte}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={alerta.nivelRelevancia === 'ALTA' ? 'danger' : 'warning'} text={alerta.nivelRelevancia === 'ALTA' ? 'light' : 'dark'} className="px-3 py-2 rounded-pill">
                            {alerta.nivelRelevancia === 'ALTA' ? 'ALTA (Fuerte ECI)' : 'MEDIA'}
                          </Badge>
                        </td>
                        <td>{renderFechaCierre(alerta)}</td>
                      </tr>
                      {expandedRow === index && (
                        <tr>
                          <td colSpan="5" className="p-0 bg-light">
                            <div className="p-4 row-expanded-content border-start border-4 border-danger">
                              <h6 className="fw-bold text-dark mb-2">
                                <i className="bi bi-card-text text-danger me-2"></i>
                                Resumen y Objeto de la Licitación
                              </h6>
                              <p className="mb-3 text-dark" style={{ fontSize: '0.95rem', whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                                {alerta.descripcion || alerta.titulo}
                              </p>

                              <div className="row g-2 mb-3 small text-secondary">
                                <div className="col-md-4">
                                  <strong><i className="bi bi-calendar-plus me-1"></i> Fecha de Apertura / Publicación:</strong>{' '}
                                  {alerta.fechaPublicacion ? new Date(alerta.fechaPublicacion).toLocaleDateString() : 'No registrada'}
                                </div>
                                <div className="col-md-4">
                                  <strong><i className="bi bi-calendar-check me-1"></i> Fecha de Cierre (Recepción de Ofertas):</strong>{' '}
                                  {alerta.fechaCierre ? new Date(alerta.fechaCierre).toLocaleDateString() : 'Verificar en cronograma del pliego'}
                                </div>
                                <div className="col-md-4">
                                  <strong><i className="bi bi-diagram-3 me-1"></i> Modalidad:</strong>{' '}
                                  {alerta.tipoInformacion}
                                </div>
                              </div>

                              <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center pt-2 border-top">
                                <div className="d-flex flex-wrap gap-2 align-items-center">
                                  <Badge bg="danger" className="fw-normal">
                                    <i className="bi bi-mortarboard me-1"></i> Línea ECI: {areasFuerte}
                                  </Badge>
                                  {palabrasClaves && (
                                    <Badge bg="white" text="dark" className="border">
                                      <i className="bi bi-key-fill text-danger me-1"></i> Coincidencias: {palabrasClaves}
                                    </Badge>
                                  )}
                                </div>
                                <a href={alerta.urlOrigen} target="_blank" rel="noreferrer" className="btn btn-sm btn-eci">
                                  <i className="bi bi-box-arrow-up-right me-1"></i> Ver pliego y cronograma en SECOP II
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Contratacion;
