const categorias = [
  "Granola",
  "Cereales",
  "Snacks",
  "Galletas",
  "Frutos Secos",
  "Panadería Integral",
  "Panadería Tradicional"
];
export default function Categorias({ categoriaActual, setCategoria }) {
  return (
    <div className="categorias-container">
      <div className="categorias">
        {categorias.map(cat => (
          <button 
            key={cat}
            className={`categoria-btn ${cat === categoriaActual ? "activo" : ""}`}
            onClick={() => setCategoria(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}