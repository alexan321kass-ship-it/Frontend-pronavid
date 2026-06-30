import { useState } from "react";
import { Search, Download, X } from "lucide-react";
import { Card } from "./Common";
import EntradaAutocompletado from "../../../compartido/components/EntradaAutocompletado";
import "../reportes.css";

export default function SalesHistory({ historial, formatearMoneda }) {
  const [busqueda, setBusqueda] = useState("");

  // Generar sugerencias únicas de clientes y productos
  const sugerencias = [
    ...new Set([
      ...historial.map(v => v.cliente),
      ...historial.map(v => v.producto)
    ])
  ];

  const historialFiltrado = historial.filter(v => 
    v.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.producto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <Card title="Historial Completo de Ventas" className="fade-in">
      <div className="historial-cabecera">
        <div className="historial-busqueda">
          <EntradaAutocompletado 
            value={busqueda}
            onChange={setBusqueda}
            suggestions={sugerencias}
            placeholder="Buscar por cliente o producto..."
          />
        </div>
        <button className="historial-boton-exportar">
          <Download size={16} /> Exportar CSV
        </button>
      </div>

      <div className="seg-table-container">
        <table className="seg-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th className="celda-centrada">Cant.</th>
              <th className="celda-derecha">Total</th>
            </tr>
          </thead>
          <tbody>
            {historialFiltrado.length > 0 ? (
              historialFiltrado.slice(0, 50).map((v, i) => (
                <tr key={i}>
                  <td>{new Date(v.fecha).toLocaleDateString()}</td>
                  <td className="celda-negrita">{v.cliente}</td>
                  <td>{v.producto}</td>
                  <td className="celda-centrada">{v.cantidad}</td>
                  <td className="celda-total">
                    {formatearMoneda(v.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="celda-vacia">
                  No se encontraron resultados para tu búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {historialFiltrado.length > 0 && (
        <div className="historial-conteo">
          Mostrando {Math.min(historialFiltrado.length, 50)} de {historialFiltrado.length} registros
        </div>
      )}
    </Card>
  );
}
