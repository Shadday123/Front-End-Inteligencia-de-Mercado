import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Badge, Button, Form } from 'react-bootstrap';
import api from '../services/api';

const Contratacion = () => {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);
  const [filtroCuantia, setFiltroCuantia] = useState('');

  const fetchAlertas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/contratacion-publica/reporte');
      let data = response.data.contratos || [];
      if (filtroCuantia === 'ALTA') {
          data = data.filter(a => a.nivelRelevancia === 'ALTA');
      }
      setAlertas(data);
    } catch (error) {
      console.error("Error al obtener alertas de SECOP", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertas();
  }, [filtroCuantia]);

  const toggleRow = (id) => {
    if (expandedRow === id) setExpandedRow(null);
    else setExpandedRow(id);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            <i className="bi bi-bank text-danger me-2"></i> 
            Prototipo 1: SECOP II
          </h3>
          <p className="text-muted mb-0 small">Monitoreo de ContrataciÃ³n PÃºblica</p>
        </div>
        <div className="d-flex gap-3">
          <Form.Select 
            value={filtroCuantia} 
            onChange={(e) => setFiltroCuantia(e.target.value)}
            disabled={loading}
            className="shadow-sm"
          >
            <option value="">Cualquier cuantÃ­a</option>
            <option value="ALTA">Solo mayores a 200 Millones (ALTA)</option>
          </Form.Select>
          <Button className="btn-eci shadow-sm" onClick={fetchAlertas} disabled={loading} style={{ minWidth: '160px' }}>
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
              <p className="mt-3 text-muted">Consultando la API de Socrata (SECOP II)...</p>
            </div>
          ) : alertas.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-inbox fs-1 text-danger opacity-50"></i>
              <p className="mt-3">No hay alertas nuevas en este momento.</p>
            </div>
          ) : (
            <Table responsive hover className="align-middle table-compact mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Entidad</th>
                  <th>TÃ­tulo / Objeto</th>
                  <th>Relevancia</th>
                  <th>Fecha Publicación SECOP</th>
                </tr>
              </thead>
              <tbody>
                {alertas.map((alerta, index) => (
                  <React.Fragment key={index}>
                    <tr onClick={() => toggleRow(index)} className="row-expandable">
                      <td className="text-center text-muted">
                        <i className={`bi bi-chevron-${expandedRow === index ? 'up' : 'down'}`}></i>
                      </td>
                      <td className="fw-semibold text-dark">{alerta.empresaEntidadRelacionada}</td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '400px' }} title={alerta.titulo}>
                          {alerta.titulo}
                        </div>
                      </td>
                      <td>
                        <Badge bg={alerta.nivelRelevancia === 'ALTA' ? 'danger' : 'warning'} className="px-3 py-2 rounded-pill">
                          {alerta.nivelRelevancia}
                        </Badge>
                      </td>
                      <td className="text-muted">{new Date(alerta.fechaPublicacion).toLocaleDateString()}</td>
                    </tr>
                    {expandedRow === index && (
                      <tr>
                        <td colSpan="5" className="p-0">
                          <div className="p-4 row-expanded-content">
                            <h6 className="fw-bold text-dark mb-2">Detalles del Proceso</h6>
                            <p className="mb-3 text-secondary" style={{ fontSize: '0.9rem' }}>{alerta.titulo}</p>
                            
                            <div className="d-flex gap-3 align-items-center">
                              <Badge bg="light" text="dark" className="border">
                                <i className="bi bi-tag-fill text-danger me-1"></i> {alerta.palabrasClaveDetectadas}
                              </Badge>
                              <a href={alerta.urlOrigen} target="_blank" rel="noreferrer" className="btn btn-sm btn-eci">
                                <i className="bi bi-box-arrow-up-right me-1"></i> Ver proceso completo en SECOP
                              </a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Contratacion;
