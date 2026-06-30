import { Pencil, Trash2 } from "lucide-react";

export default function ProductosCRUD({ productos = [], onEditar, onEliminar }) {

  if (!productos || productos.length === 0) {
    return (
      <div className="productos-container">
        <p className="celda-vacia">
          No hay productos en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="productos-container">
      <div className="productos-grid">
        {productos.map((p) => (
          <div className="producto-card" key={p.id}>

            {/* Imagen */}
            <img src={p.img} alt={p.nombre} className="producto-img" />

            {/* Nombre */}
            <h3 className="producto-nombre">{p.nombre}</h3>

            {/* Precio */}
            <p className="producto-precio">
              ${p.precio.toLocaleString()}
            </p>

            {/* Botones del CRUD */}
            <div className="crud-btns">
              <button onClick={() => onEditar(p)} className="btn-editar">
                <Pencil size={18} className="inline-block mr-1" /> Editar
              </button>

              <button onClick={() => onEliminar(p.id)} className="btn-eliminar">
                <Trash2 size={18} className="inline-block mr-1" /> Eliminar
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
